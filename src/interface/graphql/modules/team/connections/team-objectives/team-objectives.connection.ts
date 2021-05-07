import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/policy.object'
import { ConnectionRelayInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'
import { ObjectiveGraphQLNode } from '@interface/graphql/modules/objective/objective.node'

import { TeamObjectiveEdgeGraphQLObject } from './team-objective.edge'

@ObjectType('TeamObjectives', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description:
    'A list containing a given user key-results based on the provided filters and arguments',
})
export class TeamObjectivesGraphQLConnection
  implements GuardedConnectionGraphQLInterface<ObjectiveGraphQLNode> {
  @Field(() => [TeamObjectiveEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: TeamObjectiveEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
