import { Field, ObjectType } from '@nestjs/graphql'

import { ListGraphQLInterface } from '@interface/graphql/interfaces/list.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { KeyResultCommentRootEdgeGraphQLObject } from '../edges/key-result-comment-root.edge'

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
