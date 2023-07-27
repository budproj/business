export type Segment = {
  name: string
  cte: string
  params: Record<string, unknown>
  require: Segment[]
}

export type Aggregate = {
  query: string
  params: Record<string, unknown>
  require: Segment[]
}

export type AggregationQuery = {
  parameterizedSql: string
  parameters: Record<string, unknown>
}
