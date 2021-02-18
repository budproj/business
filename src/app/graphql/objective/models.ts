import { Field, Float, ID, ObjectType } from '@nestjs/graphql'

import { PolicyObject } from 'src/app/graphql/authz/models'
import { CycleObject } from 'src/app/graphql/cycle/models'
import { KeyResultCheckInObject } from 'src/app/graphql/key-result/check-in/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { EntityObject, StatusObject } from 'src/app/graphql/models'
import { UserObject } from 'src/app/graphql/user/models'

@ObjectType('ObjectiveStatus', {
  implements: () => StatusObject,
  description:
    "The current status of this objective. By status we mean progress, confidence, and other reported values from it's key results",
})
export class ObjectiveStatusObject implements StatusObject {
  @Field(() => KeyResultCheckInObject, {
    description: 'The latest reported check-in among all key results of that objective',
    nullable: true,
  })
  public latestKeyResultCheckIn?: KeyResultCheckInObject

  public progress: number
  public confidence: number
}

@ObjectType('Objective', {
  implements: () => EntityObject,
  description: 'A group of key results that has the same focus',
})
export class ObjectiveObject implements EntityObject {
  @Field({ description: 'The title(name) of the objective' })
  public title: string

  @Field(() => Float, {
    description:
      'The percentage progress increase of the objective since the last week. We consider a week as a "business" week, considering it starting on saturday and ending on friday',
  })
  public progressIncreaseSinceLastWeek: number

  @Field({ description: 'The creation date of the objective' })
  public createdAt: Date

  @Field({ description: 'The last update date of the objective' })
  public updatedAt: Date

  @Field(() => ID, { description: 'The cycle ID that owns this objective' })
  public cycleId: CycleObject['id']

  @Field(() => CycleObject, { description: 'The cycle that owns this objective' })
  public cycle: CycleObject

  @Field(() => ID, { description: 'The user ID that owns this objective' })
  public ownerId: UserObject['id']

  @Field(() => UserObject, { description: 'The user that owns this objective' })
  public owner: UserObject

  @Field(() => [KeyResultObject], {
    description: 'A creation date ordered list of key results that belongs to this objective',
    nullable: true,
  })
  public keyResults?: KeyResultObject[]

  @Field(() => ObjectiveStatusObject, {
    description:
      'The status of the given objective. Here you can fetch the current progress, confidence, and other for that objective',
  })
  public status: ObjectiveStatusObject

  public id: string
  public policies: PolicyObject
}
