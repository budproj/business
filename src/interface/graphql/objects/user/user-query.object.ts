import { Field, ObjectType } from '@nestjs/graphql'

import { QueryResultGraphQLInterface } from '@interface/graphql/interfaces/query-result.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { UserEdgesGraphQLObject } from './user-edges.object'

@ObjectType('UserQueryResult', {
  implements: () => QueryResultGraphQLInterface,
  description: 'The query result containing users based on the provided filters and arguments',
})
export class UserQueryResultGraphQLObject
  implements QueryResultGraphQLInterface<UserEdgesGraphQLObject> {
  @Field(() => UserEdgesGraphQLObject)
  public edges: UserEdgesGraphQLObject

  public pageInfo: PageInfoGraphQLObject
}
