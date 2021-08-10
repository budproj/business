import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'

import { KeyResultCheckMarkGraphQLNode } from '../../check-mark/key-result-check-mark.node'

@ObjectType('KeyResultKeyResultCheckMarkEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'The edge for our key-result query interface',
})
export class KeyResultKeyResultCheckMarkEdgeGraphQLObject
  implements EdgeRelayGraphQLInterface<KeyResultCheckMarkGraphQLNode> {
  @Field(() => KeyResultCheckMarkGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultCheckMarkGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
