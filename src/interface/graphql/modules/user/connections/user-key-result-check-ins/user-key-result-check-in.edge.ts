import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/modules/key-result/check-in/key-result-check-in.node'

@ObjectType('UserKeyResultCheckInEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'This edge represents the relation between users and their key-results',
})
export class UserKeyResultCheckInEdgeGraphQLObject
  implements EdgeRelayGraphQLInterface<KeyResultCheckInGraphQLNode>
{
  @Field(() => KeyResultCheckInGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultCheckInGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
