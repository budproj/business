import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'
import { KeyResultGraphQLNode } from '@interface/graphql/modules/key-result/key-result.node'

import { ObjectiveKeyResultEdgeGraphQLObject } from './objective-key-result.edge'

@ObjectType('ObjectiveKeyResults', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description:
    'A list containing a given user key-results based on the provided filters and arguments',
})
export class ObjectiveKeyResultsGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultGraphQLNode> {
  @Field(() => [ObjectiveKeyResultEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: ObjectiveKeyResultEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
