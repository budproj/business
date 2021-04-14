import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { KeyResultCheckInGraphQLNode } from '@interface/graphql/modules/key-result/check-in/key-result-check-in.node'
import { EdgeRelayInterface } from '@interface/graphql/relay/interfaces/edge.interface'

@ObjectType('UserKeyResultCheckInEdge', {
  implements: () => EdgeRelayInterface,
  description: 'This edge represents the relation between users and their key-results',
})
export class UserKeyResultCheckInEdgeGraphQLObject
  implements EdgeRelayInterface<KeyResultCheckInGraphQLNode> {
  @Field(() => KeyResultCheckInGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultCheckInGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
