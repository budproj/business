import { Field, ID, ObjectType } from '@nestjs/graphql'

import { KeyResultObject } from 'app/graphql/key-result/models'
import { ConfidenceReportObject } from 'app/graphql/key-result/report/confidence/models'
import { ProgressReportObject } from 'app/graphql/key-result/report/progress/models'
import { TeamObject } from 'app/graphql/team/models'

@ObjectType()
export class UserObject {
  @Field(() => ID)
  id: number

  @Field()
  name: string

  @Field()
  authzSub: string

  @Field({ nullable: true })
  role?: string

  @Field({ nullable: true })
  picture?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => [KeyResultObject])
  keyResults: KeyResultObject[]

  @Field(() => [ProgressReportObject])
  progressReports: ProgressReportObject[]

  @Field(() => [ConfidenceReportObject])
  confidenceReports: ConfidenceReportObject[]

  @Field(() => [TeamObject])
  teams: Promise<TeamObject[]>
}
