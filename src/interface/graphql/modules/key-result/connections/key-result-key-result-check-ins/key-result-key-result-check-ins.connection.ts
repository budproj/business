import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { KeyResultCheckInGraphQLNode } from '../../check-in/key-result-check-in.node'

import { KeyResultKeyResultCheckInEdgeGraphQLObject } from './key-result-key-result-check-in.edge'

@ObjectType('KeyResultKeyResultCheckIns', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing key-results based on the provided filters and arguments',
})
export class KeyResultKeyResultCheckInsGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultCheckInGraphQLNode>
{
  @Field(() => [KeyResultKeyResultCheckInEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultKeyResultCheckInEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
