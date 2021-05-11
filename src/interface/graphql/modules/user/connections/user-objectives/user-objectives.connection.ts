import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'
import { ObjectiveGraphQLNode } from '@interface/graphql/modules/objective/objective.node'

import { UserObjectiveEdgeGraphQLObject } from './user-objective.edge'

@ObjectType('UserObjectives', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
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
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
