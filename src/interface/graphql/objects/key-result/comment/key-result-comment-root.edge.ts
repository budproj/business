import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '@infrastructure/relay/interfaces/edge.interface'

import { KeyResultCommentGraphQLNode } from './key-result-comment.node'

@ObjectType('KeyResultCommentRootEdge', {
  implements: () => EdgeRelayInterface,
  description: 'The edge for our key-result comment query interface',
})
export class KeyResultCommentRootEdgeGraphQLObject
  implements EdgeRelayInterface<KeyResultCommentGraphQLNode> {
  @Field(() => KeyResultCommentGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultCommentGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
