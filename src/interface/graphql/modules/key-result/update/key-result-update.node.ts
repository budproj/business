import { Field, ID, ObjectType } from '@nestjs/graphql'

import { KeyResultStateInterface } from '@core/modules/key-result/interfaces/key-result-state.interface'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-node.interface'
import { NodePolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/node-policy.object'
import { NodeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/node.interface'

import { KeyResultStateGraphQLObject } from './objects/key-result-state.object'

@ObjectType('KeyResultUpdate', {
  implements: () => [NodeRelayGraphQLInterface, GuardedNodeGraphQLInterface],
  description: 'A update in a given key result',
})
export class KeyResultUpdateGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field(() => ID, { description: 'The id of the key result related to this update.' })
  public readonly keyResultId: string

  @Field(() => KeyResultStateGraphQLObject, {
    description: 'The state of the key result before update.',
  })
  public readonly oldState: KeyResultStateInterface

  @Field(() => KeyResultStateGraphQLObject, {
    description: 'The state of the key result before update.',
  })
  public readonly newState: KeyResultStateInterface

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
  public readonly policy?: NodePolicyGraphQLObject
}
