import { Field, Float, ID, InputType, ObjectType } from '@nestjs/graphql'

import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { UserObject } from 'src/app/graphql/user/models'

@ObjectType('ProgressReport', {
  description: 'A report that records new progress in a given key result',
})
export class ProgressReportObject {
  @Field(() => ID, { description: 'The ID of your report' })
  id: string

  @Field(() => Float, { nullable: true, description: 'The value of the latest previous report' })
  valuePrevious?: number

  @Field(() => Float, { description: 'The last value reported' })
  valueNew: number

  @Field({ nullable: true, description: 'The comment in the report' })
  comment?: string

  @Field({ description: 'The creation date of the report' })
  createdAt: Date

  @Field(() => ID, { description: 'The key result ID that this report is related to' })
  keyResultId: KeyResultObject['id']

  @Field(() => KeyResultObject, { description: 'The key result that this report relates to' })
  keyResult: KeyResultObject

  @Field(() => ID, { description: 'The user ID that owns this report' })
  userId: UserObject['id']

  @Field(() => UserObject, { description: 'The user that owns this report' })
  user: UserObject
}

@InputType({ description: 'The required data to create a new progress report' })
export class ProgressReportInput {
  @Field(() => Float, { description: 'The progress value you are reporting' })
  value: number

  @Field({ nullable: true, description: 'The comment in your report' })
  comment?: string

  @Field(() => ID, { description: 'The key result ID related to this report' })
  keyResultId: KeyResultObject['id']
}
