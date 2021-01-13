import { Field, Float, ID, InputType, Int, ObjectType } from '@nestjs/graphql'

import { KeyResultObject } from 'src/app/graphql/key-result/models'

import { ConfidenceReportObject } from './confidence/models'
import { ProgressReportObject } from './progress/models'

@InputType({ description: 'Input data to create a new check-in' })
export class CheckInInput {
  @Field(() => ID, { description: 'The key result ID that you are reporting updated to' })
  keyResultId: KeyResultObject['id']

  @Field(() => Float, { nullable: true, description: 'The new progress in the report' })
  progress?: ProgressReportObject['valueNew']

  @Field(() => Int, { nullable: true, description: 'The new confidence in the report' })
  confidence?: ConfidenceReportObject['valueNew']

  @Field({ nullable: true, description: 'The comment in your new check-in report' })
  comment?: string
}

@ObjectType('Report', { description: 'Common shared object values between multiple report types' })
export class ReportObject {
  @Field(() => ID, { description: 'The ID of the report' })
  id: ProgressReportObject['id'] | ConfidenceReportObject['id']

  @Field(() => Date, { description: 'The creation date of the report' })
  createdAt: ProgressReportObject['createdAt'] | ProgressReportObject['createdAt']
}
