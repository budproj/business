import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'
import { CycleGraphQLNode } from '@interface/graphql/modules/cycle/cycle.node'

import { TeamCycleEdgeGraphQLObject } from './team-cycle.edge'

@ObjectType('TeamCycles', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing a given user key-results based on the provided filters and arguments',
})
export class TeamCyclesGraphQLConnection implements GuardedConnectionGraphQLInterface<CycleGraphQLNode> {
  @Field(() => [TeamCycleEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: TeamCycleEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
