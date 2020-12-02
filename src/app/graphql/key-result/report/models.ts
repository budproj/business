import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql'

import { KeyResultObject } from 'app/graphql/key-result/models'

import { ConfidenceReportObject } from './confidence/models'
import { ProgressReportObject } from './progress/models'

@InputType()
export class CheckInInput {
  @Field(() => Int)
  keyResultId: KeyResultObject['id']

  @Field(() => Float)
  progress: ProgressReportObject['valueNew']

  @Field(() => Int, { nullable: true })
  confidence?: ConfidenceReportObject['valueNew']

  @Field({ nullable: true })
  comment?: string
}

@ObjectType()
export class ReportObject {
  @Field(() => Int)
  id: ProgressReportObject['id'] | ConfidenceReportObject['id']

  @Field(() => Date)
  createdAt: ProgressReportObject['createdAt'] | ProgressReportObject['createdAt']
}
