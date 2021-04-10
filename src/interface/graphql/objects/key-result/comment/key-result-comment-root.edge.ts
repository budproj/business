import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { GuardedEdgeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-edge.interface'

import { KeyResultCommentGraphQLNode } from './key-result-comment.node'

@ObjectType('KeyResultCommentRootEdge', {
  implements: () => GuardedEdgeGraphQLInterface,
  description: 'The edge for our key-result comment query interface',
})
export class KeyResultCommentRootEdgeGraphQLObject
  implements GuardedEdgeGraphQLInterface<KeyResultCommentGraphQLNode> {
  @Field(() => KeyResultCommentGraphQLNode, { complexity: 1 })
  public node!: KeyResultCommentGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor!: ConnectionCursor
}
