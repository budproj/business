import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionRelayInterface } from '@infrastructure/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@infrastructure/relay/objects/page-info.object'

import { UserRootEdgeGraphQLObject } from './user-root.edge'
import { UserGraphQLNode } from './user.node'

@ObjectType('Users', {
  implements: () => ConnectionRelayInterface,
  description: 'A list containing users based on the provided filters and arguments',
})
export class UsersGraphQLConnection implements ConnectionRelayInterface<UserGraphQLNode> {
  @Field(() => [UserRootEdgeGraphQLObject], { complexity: 0 })
  public edges!: UserRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo!: PageInfoRelayObject
}
