import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'

import { KeyResultCheckInGraphQLNode } from '../../check-in/key-result-check-in.node'

@ObjectType('KeyResultKeyResultCheckInEdge', {
  implements: () => EdgeRelayInterface,
  description: 'The edge for our key-result query interface',
})
export class KeyResultKeyResultCheckInEdgeGraphQLObject
  implements EdgeRelayInterface<KeyResultCheckInGraphQLNode> {
  @Field(() => KeyResultCheckInGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultCheckInGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
