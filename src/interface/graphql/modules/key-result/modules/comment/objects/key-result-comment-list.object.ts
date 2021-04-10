import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionGraphQLInterface } from '@interface/graphql/interfaces/connection.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { KeyResultCommentRootEdgeGraphQLObject } from '../edges/key-result-comment-root.edge'

@ObjectType('KeyResultCommentList', {
  implements: () => ConnectionGraphQLInterface,
  description: 'A list containing key-result comments based on the provided filters and arguments',
})
export class KeyResultCommentListGraphQLObject
  implements ConnectionGraphQLInterface<KeyResultCommentRootEdgeGraphQLObject> {
  @Field(() => [KeyResultCommentRootEdgeGraphQLObject], { complexity: 0 })
  public edges: KeyResultCommentRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo: PageInfoGraphQLObject
}
