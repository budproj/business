export type Segment = {
  name: string
  cte: string
  params: Record<string, unknown>
  require: Segment[]
}

export type SourceScope = 'team_scope' | 'team' | 'cycle' | 'user'

export type SourceSegment = Segment & {
  scope: SourceScope
  idColumn: string
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
