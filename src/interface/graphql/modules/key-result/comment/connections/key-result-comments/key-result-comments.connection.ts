import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { KeyResultCommentGraphQLNode } from '../../key-result-comment.node'

import { KeyResultCommentRootEdgeGraphQLObject } from './key-result-comment-root.edge'

@ObjectType('KeyResultComments', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing key-result comments based on the provided filters and arguments',
})
export class KeyResultCommentsGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultCommentGraphQLNode>
{
  @Field(() => [KeyResultCommentRootEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultCommentRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
