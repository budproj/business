import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { ConnectionRelayInterface } from '@interface/graphql/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/relay/objects/page-info.object'

import { KeyResultCheckInGraphQLNode } from '../../check-in/key-result-check-in.node'

import { KeyResultKeyResultCheckInEdgeGraphQLObject } from './key-result-key-result-check-in.edge'

@ObjectType('KeyResultKeyResultCheckIns', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing key-results based on the provided filters and arguments',
})
export class KeyResultKeyResultCheckInsGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultCheckInGraphQLNode> {
  @Field(() => [KeyResultKeyResultCheckInEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultKeyResultCheckInEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
