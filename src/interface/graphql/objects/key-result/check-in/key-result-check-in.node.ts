import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql'

import { NodeRelayInterface } from '@infrastructure/relay/interfaces/node.interface'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-node.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'

import { UserGraphQLNode } from '../../user/user.node'
import { KeyResultGraphQLNode } from '../key-result.node'

@ObjectType('KeyResultCheckIn', {
  implements: () => [NodeRelayInterface, GuardedNodeGraphQLInterface],
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
    description: 'The value increase comparing to previous check-in',
  })
  public readonly valueIncrease?: number

  @Field(() => Float, {
    complexity: 1,
    description:
      'The relative percentage progress of this check-in. It calculates the percentage of the completion for this key result, where 0% is equal to the initial value of the key result, and 100% is the goal of that given key result. Also, this metric cannot go above 100% or below 0%',
  })
  public readonly progress?: number

  @Field(() => Float, {
    complexity: 1,
    description: 'The percentage progress increase comparing to previous check-in',
  })
  public readonly progressIncrease?: number

  @Field(() => Int, {
    complexity: 1,
    description: 'The confidence increase comparing to previous check-in',
  })
  public readonly confidenceIncrease?: number

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
  public readonly policy?: PolicyGraphQLObject
}
