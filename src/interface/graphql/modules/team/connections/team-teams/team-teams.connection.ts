import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { TeamGraphQLNode } from '../../team.node'

import { TeamTeamEdgeGraphQLObject } from './team-team.edge'

@ObjectType('TeamTeams', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description:
    'A list containing a given team key-results based on the provided filters and arguments',
})
export class TeamTeamsGraphQLConnection
  implements GuardedConnectionGraphQLInterface<TeamGraphQLNode>
{
  @Field(() => [TeamTeamEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: TeamTeamEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
