import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'
import { KeyResultCommentGraphQLNode } from '@interface/graphql/modules/key-result/comment/key-result-comment.node'

import { UserKeyResultCommentEdgeGraphQLObject } from './user-key-result-comment.edge'

@ObjectType('UserKeyResultComments', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
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
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
