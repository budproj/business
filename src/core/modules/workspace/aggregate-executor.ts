import * as assert from 'assert'

import { Logger } from '@nestjs/common'
import { Connection } from 'typeorm'

import { AggregationQuery } from './workspace.interface'

type Primitive = string | number | boolean | null
type Serialized<V> = V extends Date ? string : V extends Primitive ? V : { [K in keyof V]: Serialized<V[K]> }

export type AggregateExtractor<T, V> = (value: Serialized<V>) => Partial<T>

export type WithRequired<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property]
}

export type WithOnly<Type, Key extends keyof Type> = {
  [Property in Key]-?: Type[Property]
}

type ResultsRow = { results: Record<string, unknown> }

export class AggregateExecutor<T> {
  private readonly logger = new Logger(AggregateExecutor.name)

  private readonly extractors: Array<AggregateExtractor<T, unknown>> = []

  constructor(private readonly connection: Connection) {}

  addExtractor<V>(key: string, extractor: AggregateExtractor<T, V>): this {
    this.extractors.push((results) => extractor(results[key]))
    return this
  }

  boolean(key: string, extractor: AggregateExtractor<T, boolean>): this {
    return this.addExtractor(key, extractor)
  }

  number(key: string, extractor: AggregateExtractor<T, number>): this {
    return this.addExtractor(key, extractor)
  }

  string(key: string, extractor: AggregateExtractor<T, string>): this {
    return this.addExtractor(key, extractor)
  }

  getRawQuery({ parameterizedSql, parameters }: AggregationQuery): [string, unknown[]] {
    const parameterRegex = /(?<!:):(\w+)/g

    const parameterMatches = parameterizedSql.matchAll(/(?<!:):(\w+)/g) ?? []
    const parameterKeys = [...parameterMatches].map(([, key]) => key)

    const parameterIds: Record<string, number> = [...new Set(parameterKeys)].reduce(
      (map, key, index) => ({
        ...map,
        [key]: index + 1,
      }),
      {},
    )

    const rawQuery = parameterizedSql.replace(parameterRegex, (match, key) => `$${parameterIds[key]}`)

    const values = Object.entries(parameterIds)
      .sort(([, leftId], [, rightId]) => leftId - rightId)
      .map(([key]) => parameters[key])

    return [rawQuery, values]
  }

  async execute<T, K extends keyof T>(aggregationQuery: AggregationQuery): Promise<WithOnly<T, K>> {
    this.logger.debug('About to execute query %o', aggregationQuery)

    const [query, params] = this.getRawQuery(aggregationQuery)

    const [{ results }]: [ResultsRow] = await this.connection.query(query, params)
    assert(results, 'No results found')

    return this.extractors.reduce(
      (overview, extractor) => ({
        ...overview,
        ...extractor(results),
      }),
      {},
    ) as WithOnly<T, K>
  }
}
