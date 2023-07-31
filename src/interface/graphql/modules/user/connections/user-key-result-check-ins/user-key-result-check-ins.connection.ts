import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/modules/key-result/check-in/key-result-check-in.node'

import { UserKeyResultCheckInEdgeGraphQLObject } from './user-key-result-check-in.edge'

@ObjectType('UserKeyResultCheckIns', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing a given user key-results based on the provided filters and arguments',
})
export class UserKeyResultCheckInsGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultCheckInGraphQLNode>
{
  @Field(() => [UserKeyResultCheckInEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: UserKeyResultCheckInEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
