import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { KeyResultUpdateGraphQLNode } from '../../update/key-result-update.node'

import { KeyResultKeyResultUpdateEdgeGraphQLObject } from './key-result-key-result-update.edge'

@ObjectType('KeyResultKeyResultUpdates', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing key-results updates based on the provided filters and arguments',
})
export class KeyResultKeyResultUpdatesGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultUpdateGraphQLNode>
{
  @Field(() => [KeyResultKeyResultUpdateEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultKeyResultUpdateEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
