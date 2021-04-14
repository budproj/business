import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { CycleGraphQLNode } from '@interface/graphql/modules/cycle/cycle.node'
import { ConnectionRelayInterface } from '@interface/graphql/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/relay/objects/page-info.object'

import { TeamCycleEdgeGraphQLObject } from './team-cycle.edge'

@ObjectType('TeamCycles', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description:
    'A list containing a given user key-results based on the provided filters and arguments',
})
export class TeamCyclesGraphQLConnection
  implements GuardedConnectionGraphQLInterface<CycleGraphQLNode> {
  @Field(() => [TeamCycleEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: TeamCycleEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
