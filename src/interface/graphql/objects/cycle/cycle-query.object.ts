import { Field, ObjectType } from '@nestjs/graphql'

import { QueryResultGraphQLInterface } from '@interface/graphql/interfaces/query-result.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { CycleEdgesGraphQLObject } from './cycle-edges.object'

@ObjectType('CycleQueryResult', {
  implements: () => QueryResultGraphQLInterface,
  description: 'The query result containing cycles based on the provided filters and arguments',
})
export class CycleQueryResultGraphQLObject
  implements QueryResultGraphQLInterface<CycleEdgesGraphQLObject> {
  @Field(() => CycleEdgesGraphQLObject)
  public edges: CycleEdgesGraphQLObject

  public pageInfo: PageInfoGraphQLObject
}
