import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { KeyResultGraphQLNode } from '../../key-result.node'

import { KeyResultRootEdgeGraphQLObject } from './key-result-root.edge'

@ObjectType('KeyResults', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
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
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
