import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'

import { UserGraphQLNode } from '../../user.node'

@ObjectType('UserRootEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'The edge for our user query interface',
})
export class UserRootEdgeGraphQLObject implements EdgeRelayGraphQLInterface<UserGraphQLNode> {
  @Field(() => UserGraphQLNode, { complexity: 1 })
  public readonly node!: UserGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
