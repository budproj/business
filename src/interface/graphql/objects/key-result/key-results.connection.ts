import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '../../authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '../../authorization/objects/policy.object'
import { ConnectionRelayInterface } from '../../relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '../../relay/objects/page-info.object'

import { KeyResultRootEdgeGraphQLObject } from './key-result-root.edge'
import { KeyResultGraphQLNode } from './key-result.node'

@ObjectType('KeyResults', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing key-results based on the provided filters and arguments',
})
export class KeyResultsGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultGraphQLNode> {
  @Field(() => [KeyResultRootEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
