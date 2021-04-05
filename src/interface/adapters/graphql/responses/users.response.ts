import { Field, ObjectType } from '@nestjs/graphql'

import { MetadataGraphQLObject } from '@interface/adapters/graphql/objects/metadata.object'
import { UserGraphQLObject } from '@interface/adapters/graphql/objects/user.object'

import { QueryGraphQLResponse } from './query.response'

@ObjectType('Users', {
  implements: () => QueryGraphQLResponse,
  description: 'The query result containing users based on the provided filters and arguments',
})
export class UsersGraphQLResponse implements QueryGraphQLResponse<UserGraphQLObject> {
  @Field(() => [UserGraphQLObject])
  public nodes: UserGraphQLObject[]

  public metadata: MetadataGraphQLObject
}
