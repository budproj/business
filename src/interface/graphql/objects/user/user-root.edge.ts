import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { GuardedEdgeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-edge.interface'

import { UserGraphQLNode } from './user.node'

@ObjectType('UserRootEdge', {
  implements: () => GuardedEdgeGraphQLInterface,
  description: 'The edge for our user query interface',
})
export class UserRootEdgeGraphQLObject implements GuardedEdgeGraphQLInterface<UserGraphQLNode> {
  @Field(() => UserGraphQLNode, { complexity: 1 })
  public node!: UserGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor!: ConnectionCursor
}
