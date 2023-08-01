import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { KeyResultProgressRecordGraphQLNode } from '../../progress-record/key-result-progress-record.node'

import { KeyResultProgressHistoryEdgeGraphQLObject } from './key-result-progress-history.edge'

@ObjectType('KeyResultProgressHistoryConnection', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing key-result progress records based on the provided filters and arguments',
})
export class KeyResultProgressHistoryGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultProgressRecordGraphQLNode>
{
  @Field(() => [KeyResultProgressHistoryEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultProgressHistoryEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
