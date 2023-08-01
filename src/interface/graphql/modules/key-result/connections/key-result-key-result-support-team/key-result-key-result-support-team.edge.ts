import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'

import { UserGraphQLNode } from '../../../user/user.node'

@ObjectType('KeyResultKeyResultSupportTeamEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'The edge for our users support team query interface',
})
export class KeyResultKeyResultSupportTeamEdgeGraphQLObject
  implements EdgeRelayGraphQLInterface<UserGraphQLNode>
{
  @Field(() => UserGraphQLNode, { complexity: 1 })
  public readonly node!: UserGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
