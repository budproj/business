import { Field, Float, ID, InputType, Int, ObjectType } from '@nestjs/graphql'

import { PolicyObject } from 'src/app/graphql/authz/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { EntityObject } from 'src/app/graphql/models'
import { UserObject } from 'src/app/graphql/user/models'

@ObjectType('KeyResultCheckIn', {
  implements: () => EntityObject,
  description: 'A report that records new progress in a given key result',
})
export class KeyResultCheckInObject implements EntityObject {
  @Field(() => Float, { description: 'The reported progress in this check-in' })
  public progress: number

  @Field(() => Int, { description: 'The reported confidence in this check-in' })
  public confidence: number

  @Field(() => Float, {
    description:
      'The relative percentage progress of this check-in. It calculates the percentage of the completion for this key result, where 0% is equal to the initial value of the key result, and 100% is the goal of that given key result. Also, this metric cannot go above 100% or below 0%',
  })
  public relativePercentageProgress: number

  @Field(() => Float, {
    description: 'The percentage progress increase comparing to previous check-in',
  })
  public percentageProgressIncrease: number

  @Field(() => Int, {
    description: 'The absolute confidence increase comparing to previous check-in',
  })
  public absoluteConfidenceIncrease: number

  @Field({ description: 'The creation date of the report' })
  public createdAt: Date

  @Field(() => ID, { description: 'The key result ID that this report is related to' })
  public keyResultId: KeyResultObject['id']

  @Field(() => KeyResultObject, { description: 'The key result that this report relates to' })
  public keyResult: KeyResultObject

  @Field(() => ID, { description: 'The user ID that owns this report' })
  public userId: UserObject['id']

  @Field(() => UserObject, { description: 'The user that owns this report' })
  public user: UserObject

  @Field({ description: 'The comment added in the report', nullable: true })
  public comment?: string

  @Field(() => KeyResultCheckInObject, {
    description: 'The parent check-in of this check-in',
    nullable: true,
  })
  public parent: KeyResultCheckInObject

  public id: string
  public policies: PolicyObject
}

@InputType({ description: 'The required data to create a new progress report' })
export class KeyResultCheckInInput {
  @Field(() => Float, { description: 'The progress value you are reporting' })
  public progress: number

  @Field(() => Int, { description: 'The confidence value you are reporting' })
  public confidence: number

  @Field(() => ID, { description: 'The key result ID related to this report' })
  public keyResultId: KeyResultObject['id']

  @Field({ description: 'The comment in your report', nullable: true })
  public comment?: string
}
