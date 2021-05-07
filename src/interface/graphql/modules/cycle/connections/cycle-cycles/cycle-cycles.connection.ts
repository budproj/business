import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/policy.object'
import { ConnectionRelayInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { CycleGraphQLNode } from '../../cycle.node'

import { CycleCycleEdgeGraphQLObject } from './cycle-cycle.edge'

@ObjectType('CycleCycles', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description:
    'A list containing a given cycle key-results based on the provided filters and arguments',
})
export class CycleCyclesGraphQLConnection
  implements GuardedConnectionGraphQLInterface<CycleGraphQLNode> {
  @Field(() => [CycleCycleEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: CycleCycleEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
