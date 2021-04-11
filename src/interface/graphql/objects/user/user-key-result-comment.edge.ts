import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '../../relay/interfaces/edge.interface'
import { KeyResultCommentGraphQLNode } from '../key-result/comment/key-result-comment.node'

@ObjectType('UserKeyResultCommentEdge', {
  implements: () => EdgeRelayInterface,
  description: 'This edge represents the relation between users and their key-results',
})
export class UserKeyResultCommentEdgeGraphQLObject
  implements EdgeRelayInterface<KeyResultCommentGraphQLNode> {
  @Field(() => KeyResultCommentGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultCommentGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
