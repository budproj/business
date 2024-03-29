import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { TeamGraphQLNode } from '../../team.node'

import { TeamRootEdgeGraphQLObject } from './team-root.edge'

@ObjectType('Teams', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing teams based on the provided filters and arguments',
})
export class TeamsGraphQLConnection implements GuardedConnectionGraphQLInterface<TeamGraphQLNode> {
  @Field(() => [TeamRootEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: TeamRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
