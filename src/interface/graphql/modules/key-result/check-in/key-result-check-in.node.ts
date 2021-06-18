import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql'

import { GuardedNodeGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-node.interface'
import { NodePolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/node-policy.object'
import { NodeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/node.interface'
import { KeyResultCheckInDeltaGraphQLObject } from '@interface/graphql/modules/key-result/check-in/objects/key-result-check-in-delta.object'
import { KeyResultGraphQLNode } from '@interface/graphql/modules/key-result/key-result.node'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'

@ObjectType('KeyResultCheckIn', {
  implements: () => [NodeRelayGraphQLInterface, GuardedNodeGraphQLInterface],
  description: 'A report in a given key result',
})
export class KeyResultCheckInGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field(() => Float, { complexity: 0, description: 'The reported value in this check-in' })
  public readonly value!: number

  @Field(() => Int, { complexity: 0, description: 'The reported confidence in this check-in' })
  public readonly confidence!: number

  @Field(() => ID, {
    complexity: 0,
    description: 'The key result ID that this report is related to',
  })
  public readonly keyResultId!: string

  @Field(() => ID, { complexity: 0, description: 'The user ID that owns this report' })
  public readonly userId!: string

  @Field({ complexity: 0, description: 'The comment added in the report', nullable: true })
  public readonly comment?: string

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => Float, {
    complexity: 1,
    description:
      'The relative percentage progress of this check-in. It calculates the percentage of the completion for this key result, where 0% is equal to the initial value of the key result, and 100% is the goal of that given key result. Also, this metric cannot go above 100% or below 0%',
  })
  public readonly progress?: number

  @Field(() => KeyResultGraphQLNode, {
    complexity: 1,
    description: 'The key result that this report relates to',
  })
  public readonly keyResult!: KeyResultGraphQLNode

  @Field(() => UserGraphQLNode, {
    complexity: 1,
    description: 'The user that owns this report',
  })
  public readonly user!: UserGraphQLNode

  @Field(() => KeyResultCheckInDeltaGraphQLObject, {
    complexity: 1,
    description: 'The delta of this key-result check-in comparing the previous one',
  })
  public delta!: KeyResultCheckInDeltaGraphQLObject

  @Field(() => KeyResultCheckInGraphQLNode, {
    complexity: 1,
    nullable: true,
    description: 'The parent check-in of this check-in',
  })
  public readonly parent?: KeyResultCheckInGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
  public readonly policy?: NodePolicyGraphQLObject
}
