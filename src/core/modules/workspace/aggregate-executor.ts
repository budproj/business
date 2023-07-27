import assert from 'assert'

import { Connection } from 'typeorm'

import { AggregationQuery } from './workspace.interface'

export type AggregateExtractor<T, V> = (value: V) => Partial<T>

type ResultsRow = { results: Record<string, unknown> }

export class AggregateExecutor<T> {
  private readonly extractors: Array<AggregateExtractor<T, unknown>> = []

  constructor(private readonly connection: Connection) {}

  addExtractor<V>(key: string, extractor: AggregateExtractor<T, V>): this {
    this.extractors.push((results) => extractor(results[key]))
    return this
  }

  getRawQuery({ parameterizedSql, parameters }: AggregationQuery): [string, unknown[]] {
    const parameterRegex = /(?<!:):[\w+]+/g

    const parameterKeys = new Set(parameterizedSql.match(parameterRegex) ?? [])

    const parameterIds: Record<string, number> = [...parameterKeys].reduce(
      (map, key, index) => ({
        ...map,
        [key]: index + 1,
      }),
      {},
    )

    const rawQuery = parameterizedSql.replace(parameterRegex, (key) => `$${parameterIds[key]}`)

    const values = Object.values(parameters).map((value) => (Array.isArray(value) ? `{${value.join(',')}}` : value))

    return [rawQuery, values]
  }

  async execute(aggregationQuery: AggregationQuery): Promise<Partial<T>> {
    const [query, params] = this.getRawQuery(aggregationQuery)

    // TODO: find a proper way to type these results
    const [{ results }]: [ResultsRow] = await this.connection.query(query, params)
    assert(results, 'No results found')

    // TODO: move this logic to a generic class
    return this.extractors.reduce(
      (overview, extractor) => ({
        ...overview,
        ...extractor(results),
      }),
      {},
    )
  }
}
