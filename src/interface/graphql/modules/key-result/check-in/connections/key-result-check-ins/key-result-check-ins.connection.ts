import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { KeyResultCheckInGraphQLNode } from '../../key-result-check-in.node'

import { KeyResultCheckInRootEdgeGraphQLObject } from './key-result-check-in-root.edge'

@ObjectType('KeyResultCheckIns', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing key-result comments based on the provided filters and arguments',
})
export class KeyResultCheckInsGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultCheckInGraphQLNode> {
  @Field(() => [KeyResultCheckInRootEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultCheckInRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
