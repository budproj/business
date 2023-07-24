import { Logger } from '@nestjs/common'

import { OverviewCte, OverviewCteFactory } from './overview-cte.factory'

export type OverviewAggregate = {
  query: string
  params: Record<string, unknown>
  require: OverviewCte[]
}

type AddAggregateArgs = Pick<OverviewAggregate, 'params' | 'require'> & {
  name: string
  dataColumn: string
  source: string
}

export class OverviewAggregator {
  private readonly logger = new Logger(OverviewAggregator.name)

  private readonly cteFactory: OverviewCteFactory

  private readonly aggregates: Record<string, OverviewAggregate> = {}

  constructor(private readonly source: OverviewCte) {
    this.cteFactory = new OverviewCteFactory(source)
  }

  addAggregate({ name, dataColumn, source, params, require }: AddAggregateArgs): void {
    this.aggregates[name] = {
      query: `
        SELECT '${name}' AS key,
               ${dataColumn} AS data
        FROM ${source}
      `,
      params,
      require,
    }
  }

  count(segment: OverviewCte): string {
    const name = `count_${segment.name}`

    const dataColumn = 'cast(cast(count(*) AS TEXT) AS JSON)'

    const source = `"${segment.name}"`

    this.addAggregate({
      name,
      dataColumn,
      source,
      params: {},
      require: [segment],
    })

    return name
  }

  countGroupBy(segment: OverviewCte, groupBy: string): string {
    const name = `count_${segment.name}_group_by_${groupBy}`

    const dataColumn = 'json_object_agg(subkey, count)'

    const source = `
      (
        SELECT "${groupBy}",
               count(*)
        FROM "${segment.name}" kr
        GROUP BY 1
      ) AS confidence_count(subkey, count)
    `

    this.addAggregate({
      name,
      dataColumn,
      source,
      params: {},
      require: [segment],
    })

    return name
  }

  countObjectives(...params: Parameters<OverviewCteFactory['objectives']>): string {
    const segment = this.cteFactory.objectives(...params)

    return this.count(segment)
  }

  countObjectivesByMode(...params: Parameters<OverviewCteFactory['objectives']>): string {
    const segment = this.cteFactory.objectives(...params)

    return this.countGroupBy(segment, 'mode')
  }

  countKeyResults(...params: Parameters<OverviewCteFactory['keyResults']>): string {
    const segment = this.cteFactory.keyResults(...params)

    return this.count(segment)
  }

  countKeyResultsByMode(...params: Parameters<OverviewCteFactory['keyResults']>): string {
    const segment = this.cteFactory.keyResults(...params)

    return this.countGroupBy(segment, 'mode')
  }

  countKeyResultsByConfidence(...params: Parameters<OverviewCteFactory['keyResultLatestCheckIns']>): string {
    const keyResultSegment = this.cteFactory.keyResults(...params)
    const latestCheckInSegment = this.cteFactory.keyResultLatestCheckIns(...params)

    const groupBy = 'confidence'

    const name = `count_${keyResultSegment.name}_group_by_${groupBy}`

    const dataColumn = 'json_object_agg(subkey, count)'

    const source = `
      (
        SELECT coalesce(krck.confidence, 100),
               count(*)
        FROM "${keyResultSegment.name}" kr
            LEFT JOIN "${latestCheckInSegment.name}" krck ON krck.key_result_id = kr.id
        GROUP BY 1
      ) AS confidence_count(subkey, count)
    `

    this.addAggregate({
      name,
      dataColumn,
      source,
      params: {},
      require: [keyResultSegment, latestCheckInSegment],
    })

    return name
  }

  getQuery(): [string, Record<string, unknown>] {
    const ctes = this.mapCtes(this.aggregates)

    const cteQueries = Object.values(ctes).reduce((list, { cte }) => [...list, cte], [])

    const cteParams = Object.values(ctes).reduce((map, { params }) => ({ ...map, ...params }), {})

    const aggregateQueries = Object.values(this.aggregates).reduce((list, { query }) => [...list, query], [])

    const aggregateParams = Object.values(this.aggregates).reduce((map, { params }) => ({ ...map, ...params }), {})

    const fullQuery = `
      WITH RECURSIVE ${[this.source.cte, ...cteQueries].join(', ')}
      SELECT json_object_agg(key, data) AS results
      FROM (${aggregateQueries.join('\nUNION ALL\n')}) AS results(key, data)
    `

    // TODO: would be nice to suffix each query parameter to prevent collisions
    const globalParams = {
      ...this.source.params,
      ...cteParams,
      ...aggregateParams,
    }

    return [fullQuery, globalParams]
  }

  getRawQuery(): [string, unknown[]] {
    const [parameterizedQuery, params] = this.getQuery()

    this.logger.debug('Parameterized query: %o', parameterizedQuery)
    this.logger.debug('Parameters: %o', params)

    const parameterRegex = /(?<!:):[\w+]+/g

    const parameterKeys = new Set(parameterizedQuery.match(parameterRegex) ?? [])

    const parameterIds: Record<string, number> = [...parameterKeys].reduce(
      (map, key, index) => ({
        ...map,
        [key]: index + 1,
      }),
      {},
    )

    const rawQuery = parameterizedQuery.replace(parameterRegex, (key) => `$${parameterIds[key]}`)

    const values = Object.values(params).map((value) => (Array.isArray(value) ? `{${value.join(',')}}` : value))

    this.logger.debug('Raw query: %o', rawQuery)
    this.logger.debug('Parameter values: %o', values)

    return [rawQuery, values]
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private deduplicateCtes(ctes: OverviewCte[]): Record<string, Omit<OverviewCte, 'require'>> {
    return ctes.reduce(
      (map, cte) => ({
        ...map,
        [cte.name]: {
          name: cte.name,
          cte: cte.cte,
          params: cte.params,
        },
        ...this.deduplicateCtes(cte.require),
      }),
      {},
    )
  }

  private mapCtes(
    aggregates: typeof this.aggregates,
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): Record<string, Omit<OverviewCte, 'require'>> {
    const ctes = Object.values(aggregates).flatMap(({ require }) => require)

    return this.deduplicateCtes(ctes)
  }
}
