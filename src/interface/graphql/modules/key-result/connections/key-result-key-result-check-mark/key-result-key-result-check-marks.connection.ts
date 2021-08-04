import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { KeyResultCheckMarkGraphQLNode } from '../../check-mark/key-result-check-mark.node'

import { KeyResultKeyResultCheckMarkEdgeGraphQLObject } from './key-result-key-result-check-mark.edge'

@ObjectType('KeyResultKeyResultCheckMarks', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing key-results check marks based on the provided filters and arguments',
})
export class KeyResultKeyResultCheckMarkGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultCheckMarkGraphQLNode> {
  @Field(() => [KeyResultKeyResultCheckMarkEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultKeyResultCheckMarkEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
