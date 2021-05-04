import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'

import { UserGraphQLNode } from '../../user.node'

@ObjectType('UserRootEdge', {
  implements: () => EdgeRelayInterface,
  description: 'The edge for our user query interface',
})
export class UserRootEdgeGraphQLObject implements EdgeRelayInterface<UserGraphQLNode> {
  @Field(() => UserGraphQLNode, { complexity: 1 })
  public readonly node!: UserGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
