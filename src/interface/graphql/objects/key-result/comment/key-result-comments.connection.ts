import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '../../../authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '../../../authorization/objects/policy.object'
import { ConnectionRelayInterface } from '../../../relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '../../../relay/objects/page-info.object'

import { KeyResultCommentRootEdgeGraphQLObject } from './key-result-comment-root.edge'
import { KeyResultCommentGraphQLNode } from './key-result-comment.node'

@ObjectType('KeyResultComments', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing key-result comments based on the provided filters and arguments',
})
export class KeyResultCommentsGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultCommentGraphQLNode> {
  @Field(() => [KeyResultCommentRootEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultCommentRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
