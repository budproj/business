import { SegmentFactory } from './segment.factory'
import { Aggregate, AggregationQuery, Segment } from './workspace.interface'

type AddAggregateArgs = Pick<Aggregate, 'params' | 'require'> & {
  name: string
  dataColumn: string
  source: string
}

export class AggregateFactory {
  private readonly segmentFactory: SegmentFactory

  private readonly aggregates: Record<string, Aggregate> = {}

  constructor(private readonly source: Segment) {
    this.segmentFactory = new SegmentFactory(source)
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

  count(segment: Segment): string {
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

  countGroupBy(segment: Segment, groupBy: string): string {
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

  getQuery(): AggregationQuery {
    const segments = this.mapSegments(this.aggregates)

    const cteQueries = Object.values(segments).reduce((list, { cte }) => [...list, cte], [])

    const cteParams = Object.values(segments).reduce((map, { params }) => ({ ...map, ...params }), {})

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

    return {
      parameterizedSql: fullQuery,
      parameters: globalParams,
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private deduplicateSegments(segments: Segment[]): Record<string, Omit<Segment, 'require'>> {
    return segments.reduce(
      (map, cte) => ({
        ...map,
        [cte.name]: {
          name: cte.name,
          cte: cte.cte,
          params: cte.params,
        },
        ...this.deduplicateSegments(cte.require),
      }),
      {},
    )
  }

  private mapSegments(
    aggregates: typeof this.aggregates,
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): Record<string, Omit<Segment, 'require'>> {
    const segments = Object.values(aggregates).flatMap(({ require }) => require)

    return this.deduplicateSegments(segments)
  }
}
