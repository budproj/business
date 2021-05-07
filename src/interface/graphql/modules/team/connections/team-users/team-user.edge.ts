import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'

@ObjectType('TeamUserEdge', {
  implements: () => EdgeRelayInterface,
  description: 'This edge represents the relation between teams and their users',
})
export class TeamUserEdgeGraphQLObject implements EdgeRelayInterface<UserGraphQLNode> {
  @Field(() => UserGraphQLNode, { complexity: 1 })
  public readonly node!: UserGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
