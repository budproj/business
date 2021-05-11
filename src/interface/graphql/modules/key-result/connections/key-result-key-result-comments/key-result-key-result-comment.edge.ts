import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'

import { KeyResultCommentGraphQLNode } from '../../comment/key-result-comment.node'

@ObjectType('KeyResultKeyResultCommentEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'The edge for our key-result query interface',
})
export class KeyResultKeyResultCommentEdgeGraphQLObject
  implements EdgeRelayGraphQLInterface<KeyResultCommentGraphQLNode> {
  @Field(() => KeyResultCommentGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultCommentGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
