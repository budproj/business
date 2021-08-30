import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { KeyResultCommentGraphQLNode } from '../../comment/key-result-comment.node'

import { KeyResultKeyResultCommentEdgeGraphQLObject } from './key-result-key-result-comment.edge'

@ObjectType('KeyResultKeyResultComments', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing key-results based on the provided filters and arguments',
})
export class KeyResultKeyResultCommentsGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultCommentGraphQLNode>
{
  @Field(() => [KeyResultKeyResultCommentEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultKeyResultCommentEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
