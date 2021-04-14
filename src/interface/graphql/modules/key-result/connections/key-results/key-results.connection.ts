import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { ConnectionRelayInterface } from '@interface/graphql/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/relay/objects/page-info.object'

import { KeyResultGraphQLNode } from '../../key-result.node'

import { KeyResultRootEdgeGraphQLObject } from './key-result-root.edge'

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
