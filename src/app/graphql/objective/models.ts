import { Field, Float, ID, ObjectType } from '@nestjs/graphql'

import { CycleObject } from 'src/app/graphql/cycle/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { ConfidenceReportObject } from 'src/app/graphql/key-result/report/confidence'
import { ProgressReportObject } from 'src/app/graphql/key-result/report/progress'
import { UserObject } from 'src/app/graphql/user/models'

@ObjectType('Objective', { description: 'A group of key results that has the same focus' })
export class ObjectiveObject {
  @Field(() => ID, { description: 'The ID of the objective' })
  id: string

  @Field({ description: 'The title(name) of the objective' })
  title: string

  @Field({ description: 'The creation date of the objective' })
  createdAt: Date

  @Field({ description: 'The last update date of the objective' })
  updatedAt: Date

  @Field(() => [KeyResultObject], {
    description: 'A creation date ordered list of key results that belongs to this objective',
  })
  keyResults: KeyResultObject[]

  @Field(() => ID, { description: 'The cycle ID that owns this objective' })
  cycleId: CycleObject['id']

  @Field(() => CycleObject, { description: 'The cycle that owns this objective' })
  cycle: CycleObject

  @Field(() => ID, { description: 'The user ID that owns this objective' })
  ownerId: UserObject['id']

  @Field(() => UserObject, { description: 'The user that owns this objective' })
  owner: UserObject

  @Field(() => Float, {
    description: 'The computed percentage current progress of this objective',
    nullable: true,
  })
  currentProgress: ProgressReportObject['valueNew']

  @Field(() => Float, {
    description: 'The computed current confidence of this objective',
    nullable: true,
  })
  currentConfidence: ConfidenceReportObject['valueNew']

  @Field(() => Float, {
    description: 'The percentage progress increase since last monday',
  })
  percentageProgressIncrease: number
}
