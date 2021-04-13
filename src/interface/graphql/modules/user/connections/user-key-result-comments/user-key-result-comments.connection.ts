import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { KeyResultCommentGraphQLNode } from '@interface/graphql/modules/key-result/comment/key-result-comment.node'
import { ConnectionRelayInterface } from '@interface/graphql/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/relay/objects/page-info.object'

import { UserKeyResultCommentEdgeGraphQLObject } from './user-key-result-comment.edge'

@ObjectType('UserKeyResultComments', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description:
    'A list containing a given user key-results based on the provided filters and arguments',
})
export class UserKeyResultCommentsGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultCommentGraphQLNode> {
  @Field(() => [UserKeyResultCommentEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: UserKeyResultCommentEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
