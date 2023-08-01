import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'

import { ObjectiveTeamEdgeGraphQLObject } from './objective-team.edge'

@ObjectType('ObjectiveTeams', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description:
    'A list containing a given objective support teams based on the provided filters and arguments',
})
export class ObjectiveTeamsGraphQLConnection
  implements GuardedConnectionGraphQLInterface<TeamGraphQLNode>
{
  @Field(() => [ObjectiveTeamEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: ObjectiveTeamEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
