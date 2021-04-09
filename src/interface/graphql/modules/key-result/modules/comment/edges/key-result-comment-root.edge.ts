import { Field, ObjectType } from '@nestjs/graphql'

import { EdgeGraphQLInterface } from '@interface/graphql/interfaces/edge.interface'
import { KeyResultCommentGraphQLNode } from '@interface/graphql/nodes/key-result-comment.node'

@ObjectType('KeyResultCommentRootEdge', {
  implements: () => EdgeGraphQLInterface,
  description: 'The edge for our key-result comment query interface',
})
export class KeyResultCommentRootEdgeGraphQLObject
  implements EdgeGraphQLInterface<KeyResultCommentGraphQLNode> {
  @Field(() => KeyResultCommentGraphQLNode, { complexity: 1 })
  public node: KeyResultCommentGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor: string
}
