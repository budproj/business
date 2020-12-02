import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { ObjectiveObject } from 'app/graphql/objective/models'
import { TeamObject } from 'app/graphql/team/models'
import { UserObject } from 'app/graphql/user/models'
import { KeyResultFormat } from 'domain/key-result/types'

import { ConfidenceReportObject } from './report/confidence/models'
import { ProgressReportObject } from './report/progress/models'

registerEnumType(KeyResultFormat, {
  name: 'KeyResultFormat',
  description: 'Each format represents how our user wants to see the metrics of the key result',
})

@ObjectType()
export class KeyResultObject {
  @Field(() => ID)
  id: number

  @Field()
  title: string

  @Field({ nullable: true })
  description?: string

  @Field(() => Float)
  initialValue: number

  @Field(() => Float)
  goal: number

  @Field()
  format: KeyResultFormat

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => ID)
  ownerId: UserObject['id']

  @Field(() => UserObject)
  owner: UserObject

  @Field(() => ID)
  objectiveId: ObjectiveObject['id']

  @Field(() => ObjectiveObject)
  objective: ObjectiveObject

  @Field(() => ID)
  teamId: TeamObject['id']

  @Field(() => TeamObject)
  team: TeamObject

  @Field(() => [ProgressReportObject])
  progressReports: ProgressReportObject[]

  @Field(() => [ConfidenceReportObject])
  confidenceReports: ConfidenceReportObject[]
}
