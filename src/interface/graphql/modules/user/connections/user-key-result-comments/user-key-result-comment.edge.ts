import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'
import { KeyResultCommentGraphQLNode } from '@interface/graphql/modules/key-result/comment/key-result-comment.node'

@ObjectType('UserKeyResultCommentEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'This edge represents the relation between users and their key-results',
})
export class UserKeyResultCommentEdgeGraphQLObject implements EdgeRelayGraphQLInterface<KeyResultCommentGraphQLNode> {
  @Field(() => KeyResultCommentGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultCommentGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
