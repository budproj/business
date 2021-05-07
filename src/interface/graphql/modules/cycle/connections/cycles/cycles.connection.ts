import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/policy.object'
import { ConnectionRelayInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { CycleGraphQLNode } from '../../cycle.node'

import { CycleRootEdgeGraphQLObject } from './cycle-root.edge'

@ObjectType('Cycles', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing cycles based on the provided filters and arguments',
})
export class CyclesGraphQLConnection implements ConnectionRelayInterface<CycleGraphQLNode> {
  @Field(() => [CycleRootEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: CycleRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
