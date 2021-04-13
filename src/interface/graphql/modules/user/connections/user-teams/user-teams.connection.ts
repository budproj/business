import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { TeamGraphQLNode } from '@interface/graphql/objects/team/team.node'
import { ConnectionRelayInterface } from '@interface/graphql/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/relay/objects/page-info.object'

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
  public readonly policy!: PolicyGraphQLObject
}
