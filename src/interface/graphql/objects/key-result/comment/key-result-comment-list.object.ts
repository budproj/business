import { Field, ObjectType } from '@nestjs/graphql'

import { ListGraphQLInterface } from '../../../interfaces/list.interface'
import { PageInfoGraphQLObject } from '../../page-info.object'

import { KeyResultCommentRootEdgeGraphQLObject } from './key-result-comment-root-edge.object'

@ObjectType('KeyResultCommentList', {
  implements: () => ListGraphQLInterface,
  description: 'A list containing key-result comments based on the provided filters and arguments',
})
export class KeyResultCommentListGraphQLObject
  implements ListGraphQLInterface<KeyResultCommentRootEdgeGraphQLObject> {
  @Field(() => [KeyResultCommentRootEdgeGraphQLObject], { complexity: 0 })
  public edges: KeyResultCommentRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo: PageInfoGraphQLObject
}
