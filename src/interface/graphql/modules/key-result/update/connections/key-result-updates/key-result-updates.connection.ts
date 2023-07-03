import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { KeyResultUpdateGraphQLNode } from '../../key-result-update.node'

import { KeyResultUpdateRootEdgeGraphQLObject } from './key-result-update-root.edge'

@ObjectType('KeyResultUpdates', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing key-result updates based on the provided filters and arguments',
})
export class KeyResultUpdatesGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultUpdateGraphQLNode>
{
  @Field(() => [KeyResultUpdateRootEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultUpdateRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
