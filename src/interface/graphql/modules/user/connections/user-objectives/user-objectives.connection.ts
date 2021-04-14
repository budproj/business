import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { ObjectiveGraphQLNode } from '@interface/graphql/modules/objective/objective.node'
import { ConnectionRelayInterface } from '@interface/graphql/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/relay/objects/page-info.object'

import { UserObjectiveEdgeGraphQLObject } from './user-objective.edge'

@ObjectType('UserObjectives', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description:
    'A list containing a given user objectives based on the provided filters and arguments',
})
export class UserObjectivesGraphQLConnection
  implements GuardedConnectionGraphQLInterface<ObjectiveGraphQLNode> {
  @Field(() => [UserObjectiveEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: UserObjectiveEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
