import { Field, ObjectType } from '@nestjs/graphql'

import { EdgesGraphQLInterface } from '../../../interfaces/edges.interface'

import { KeyResultCommentNodeGraphQLObject } from './key-result-comment-node.object'

@ObjectType('KeyResultCommentEdges', {
  implements: () => EdgesGraphQLInterface,
  description: 'The edges for our key-result comment query interface',
})
export class KeyResultCommentEdgesGraphQLObject
  implements EdgesGraphQLInterface<KeyResultCommentNodeGraphQLObject> {
  @Field(() => [KeyResultCommentNodeGraphQLObject])
  public nodes: KeyResultCommentNodeGraphQLObject[]

  public cursor: string
}
