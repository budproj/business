import { Field, ObjectType } from '@nestjs/graphql'

import { QueryResultGraphQLInterface } from '@interface/graphql/interfaces/query-result.interface'

import { MetadataGraphQLObject } from './metadata.object'
import { UserGraphQLObject } from './user.object'

@ObjectType('Users', {
  implements: () => QueryResultGraphQLInterface,
  description: 'The query result containing users based on the provided filters and arguments',
})
export class UsersQueryResultGraphQLObject
  implements QueryResultGraphQLInterface<UserGraphQLObject> {
  @Field(() => [UserGraphQLObject])
  public nodes: UserGraphQLObject[]

  public metadata: MetadataGraphQLObject
}
