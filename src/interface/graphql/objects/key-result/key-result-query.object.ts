import { Field, ObjectType } from '@nestjs/graphql'

import { QueryResultGraphQLInterface } from '@interface/graphql/interfaces/query-result.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { KeyResultEdgesGraphQLObject } from './key-result-edges.object'

@ObjectType('KeyResultQueryResult', {
  implements: () => QueryResultGraphQLInterface,
  description:
    'The query result containing key-results based on the provided filters and arguments',
})
export class KeyResultQueryResultGraphQLObject
  implements QueryResultGraphQLInterface<KeyResultEdgesGraphQLObject> {
  @Field(() => KeyResultEdgesGraphQLObject)
  public edges: KeyResultEdgesGraphQLObject

  public pageInfo: PageInfoGraphQLObject
}
