import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'

import { UserTeamEdgeGraphQLObject } from './user-team.edge'

@ObjectType('UserTeams', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing a given user teams based on the provided filters and arguments',
})
export class UserTeamsGraphQLConnection
  implements GuardedConnectionGraphQLInterface<TeamGraphQLNode> {
  @Field(() => [UserTeamEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: UserTeamEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
}
