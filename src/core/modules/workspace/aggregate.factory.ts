import { SegmentFactory } from './segment.factory'
import { Aggregate, AggregationQuery, Segment, SourceSegment } from './workspace.interface'

type AddAggregateArgs = Pick<Aggregate, 'params' | 'require'> & {
  name: string
  dataColumn: string
  source: string
}

export class AggregateFactory {
  private readonly segmentFactory: SegmentFactory

  private readonly aggregates: Record<string, Aggregate> = {}

  constructor(private readonly source: SourceSegment) {
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

  fn(segment: Segment, function_: string, column: string): string {
    const name = `${function_}_${segment.name}_${column === '*' ? '' : column}`

    const dataColumn = `to_json(${function_}(${column === '*' ? column : `"${column}"`}))`

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

  fnGroupBy(segment: Segment, groupBy: string, function_: string, column: string): string {
    const name = `${function_}_${segment.name}_group_by_${groupBy}_${column === '*' ? '' : column}`

    const dataColumn = 'json_object_agg(subkey, count)'

    const source = `
      (
        SELECT "${groupBy}",
               ${function_}("${column}")
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

    const ctes = [this.source.cte, ...cteQueries]

    const fullQuery = `
      WITH RECURSIVE ${ctes.join(', ')}
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

  private mapSegments(aggregates: typeof this.aggregates): Record<string, Omit<Segment, 'require'>> {
    const segments = Object.values(aggregates).flatMap(({ require }) => require)

    return this.deduplicateSegments(segments)
  }
}