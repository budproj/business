import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'

import { KeyResultKeyResultSupportTeamEdgeGraphQLObject } from './key-result-key-result-support-team.edge'

@ObjectType('KeyResultKeyResultSupportTeam', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing users support team based on the provided filters and arguments',
})
export class KeyResultKeyResultSupportTeamGraphQLConnection
  implements GuardedConnectionGraphQLInterface<UserGraphQLNode>
{
  @Field(() => [KeyResultKeyResultSupportTeamEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultKeyResultSupportTeamEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
