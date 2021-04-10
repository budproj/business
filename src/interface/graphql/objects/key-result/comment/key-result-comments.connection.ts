import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionRelayInterface } from '@infrastructure/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@infrastructure/relay/objects/page-info.object'

import { KeyResultCommentRootEdgeGraphQLObject } from './key-result-comment-root.edge'
import { KeyResultCommentGraphQLNode } from './key-result-comment.node'

@ObjectType('KeyResultComments', {
  implements: () => ConnectionRelayInterface,
  description: 'A list containing key-result comments based on the provided filters and arguments',
})
export class KeyResultCommentsGraphQLConnection
  implements ConnectionRelayInterface<KeyResultCommentGraphQLNode> {
  @Field(() => [KeyResultCommentRootEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultCommentRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
}
