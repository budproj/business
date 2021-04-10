import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionRelayInterface } from '@infrastructure/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@infrastructure/relay/objects/page-info.object'

import { GuardedConnectionGraphQLInterface } from '../../authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '../../authorization/objects/policy.object'
import { TeamGraphQLNode } from '../team/team.node'

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
