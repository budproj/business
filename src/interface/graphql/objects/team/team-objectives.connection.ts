import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '../../authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '../../authorization/objects/policy.object'
import { ConnectionRelayInterface } from '../../relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '../../relay/objects/page-info.object'
import { ObjectiveGraphQLNode } from '../objective/objective.node'

import { TeamObjectivesEdgeGraphQLObject } from './team-objectives.edge'

@ObjectType('TeamObjectives', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description:
    'A list containing a given user key-results based on the provided filters and arguments',
})
export class TeamObjectivesGraphQLConnection
  implements GuardedConnectionGraphQLInterface<ObjectiveGraphQLNode> {
  @Field(() => [TeamObjectivesEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: TeamObjectivesEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
