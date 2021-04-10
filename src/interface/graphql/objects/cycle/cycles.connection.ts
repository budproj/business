import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionRelayInterface } from '@infrastructure/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@infrastructure/relay/objects/page-info.object'

import { GuardedConnectionGraphQLInterface } from '../../authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '../../authorization/objects/policy.object'

import { CycleRootEdgeGraphQLObject } from './cycle-root.edge'
import { CycleGraphQLNode } from './cycle.node'

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
