import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '../../authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '../../authorization/objects/policy.object'
import { ConnectionRelayInterface } from '../../relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '../../relay/objects/page-info.object'

import { TeamRootEdgeGraphQLObject } from './team-root.edge'
import { TeamGraphQLNode } from './team.node'

@ObjectType('Teams', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing teams based on the provided filters and arguments',
})
export class TeamsGraphQLConnection implements GuardedConnectionGraphQLInterface<TeamGraphQLNode> {
  @Field(() => [TeamRootEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: TeamRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
