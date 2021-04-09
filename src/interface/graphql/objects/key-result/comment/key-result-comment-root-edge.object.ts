import { Field, ObjectType } from '@nestjs/graphql'

import { EdgeGraphQLInterface } from '../../../interfaces/edge.interface'

import { KeyResultCommentNodeGraphQLObject } from './key-result-comment-node.object'

@ObjectType('KeyResultCommentRootEdge', {
  implements: () => EdgeGraphQLInterface,
  description: 'The edge for our key-result comment query interface',
})
export class KeyResultCommentRootEdgeGraphQLObject
  implements EdgeGraphQLInterface<KeyResultCommentNodeGraphQLObject> {
  @Field(() => KeyResultCommentNodeGraphQLObject, { complexity: 1 })
  public node: KeyResultCommentNodeGraphQLObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor: string
}
