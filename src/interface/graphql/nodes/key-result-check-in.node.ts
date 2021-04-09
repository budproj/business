import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql'

import { PolicyGraphQLObject } from '../authorization/objects/policy.object'
import { NodeGraphQLInterface } from '../interfaces/node.interface'

import { KeyResultGraphQLNode } from './key-result.node'
import { UserGraphQLNode } from './user.node'

@ObjectType('KeyResultCheckIn', {
  implements: () => NodeGraphQLInterface,
  description: 'A report in a given key result',
})
export class KeyResultCheckInGraphQLNode implements NodeGraphQLInterface {
  @Field(() => Float, { complexity: 0, description: 'The reported value in this check-in' })
  public value: number

  @Field(() => Int, { complexity: 0, description: 'The reported confidence in this check-in' })
  public confidence: number

  @Field(() => ID, {
    complexity: 0,
    description: 'The key result ID that this report is related to',
  })
  public keyResultId: KeyResultGraphQLNode['id']

  @Field(() => ID, { complexity: 0, description: 'The user ID that owns this report' })
  public userId: UserGraphQLNode['id']

  @Field({ complexity: 0, description: 'The comment added in the report', nullable: true })
  public comment?: string

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => Float, {
    complexity: 1,
    description: 'The value increase comparing to previous check-in',
  })
  public valueIncrease?: number

  @Field(() => Float, {
    complexity: 1,
    description:
      'The relative percentage progress of this check-in. It calculates the percentage of the completion for this key result, where 0% is equal to the initial value of the key result, and 100% is the goal of that given key result. Also, this metric cannot go above 100% or below 0%',
  })
  public progress?: number

  @Field(() => Float, {
    complexity: 1,
    description: 'The percentage progress increase comparing to previous check-in',
  })
  public progressIncrease?: number

  @Field(() => Int, {
    complexity: 1,
    description: 'The confidence increase comparing to previous check-in',
  })
  public confidenceIncrease?: number

  @Field(() => KeyResultGraphQLNode, {
    complexity: 1,
    description: 'The key result that this report relates to',
  })
  public keyResult: KeyResultGraphQLNode

  @Field(() => UserGraphQLNode, {
    complexity: 1,
    description: 'The user that owns this report',
  })
  public user: UserGraphQLNode

  @Field(() => KeyResultCheckInGraphQLNode, {
    complexity: 1,
    nullable: true,
    description: 'The parent check-in of this check-in',
  })
  public parent?: KeyResultCheckInGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public id: string
  public createdAt: Date
  public policies?: PolicyGraphQLObject
}
