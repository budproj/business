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

  fn(segment: Segment, fn: string, column: string): string {
    const name = `${fn}_${segment.name}_${column === '*' ? '' : column}`

    const dataColumn = `to_json(${fn}(${column === '*' ? column : `"${column}"`}))`

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

  count(segment: Segment): string {
    return this.fn(segment, 'count', '*')
  }

  min(segment: Segment, column: string): string {
    return this.fn(segment, 'min', column)
  }

  max(segment: Segment, column: string): string {
    return this.fn(segment, 'max', column)
  }

  average(segment: Segment, column: string): string {
    return this.fn(segment, 'avg', column)
  }

  sum(segment: Segment, column: string): string {
    return this.fn(segment, 'sum', column)
  }

  fnGroupBy(segment: Segment, groupBy: string, fn: string, column: string): string {
    const name = `${fn}_${segment.name}_group_by_${groupBy}_${column === '*' ? '' : column}`

    const dataColumn = 'json_object_agg(subkey, count)'

    const source = `
      (
        SELECT "${groupBy}",
               ${fn}("${column}")
        FROM "${segment.name}" kr
        GROUP BY 1
      ) AS result_tuple(subkey, count)
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

  countGroupBy(segment: Segment, groupBy: string): string {
    return this.fnGroupBy(segment, groupBy, 'count', '*')
  }

  minGroupBy(segment: Segment, groupBy: string, column: string): string {
    return this.fnGroupBy(segment, groupBy, 'min', column)
  }

  maxGroupBy(segment: Segment, groupBy: string, column: string): string {
    return this.fnGroupBy(segment, groupBy, 'max', column)
  }

  averageGroupBy(segment: Segment, groupBy: string, column: string): string {
    return this.fnGroupBy(segment, groupBy, 'avg', column)
  }

  sumGroupBy(segment: Segment, groupBy: string, column: string): string {
    return this.fnGroupBy(segment, groupBy, 'sum', column)
  }

  getQuery(): AggregationQuery {
    const segments = this.mapSegments(this.aggregates)

    const cteQueries = Object.values(segments).reduce((list, { cte }) => [...list, cte], [])

    const cteParams = Object.values(segments).reduce((map, { params }) => ({ ...map, ...params }), {})

    const aggregateQueries = Object.values(this.aggregates).reduce<string[]>((list, { query }) => [...list, query], [])

    const aggregateParams = Object.values(this.aggregates).reduce((map, { params }) => ({ ...map, ...params }), {})

    const fullQuery = `
      WITH RECURSIVE ${[this.source.cte, ...cteQueries].join(', ')}
      SELECT json_object_agg(key, data) AS results
      FROM (${aggregateQueries.map((sql) => `(${sql})`).join('\nUNION ALL\n')}) AS results(key, data)
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
