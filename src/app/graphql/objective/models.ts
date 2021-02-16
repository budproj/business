import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql'

import { PolicyObject } from 'src/app/graphql/authz/models'
import { CycleObject } from 'src/app/graphql/cycle/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { EntityObject } from 'src/app/graphql/models'
import { UserObject } from 'src/app/graphql/user/models'

@ObjectType('Objective', {
  implements: () => EntityObject,
  description: 'A group of key results that has the same focus',
})
export class ObjectiveObject implements EntityObject {
  @Field({ description: 'The title(name) of the objective' })
  public title: string

  @Field(() => Float, {
    description: 'The computed percentage current progress of this objective',
  })
  public currentProgress: number

  @Field(() => Int, {
    description: 'The computed current confidence of this objective',
  })
  public currentConfidence: number

  @Field(() => Float, {
    description:
      'The percentage progress increase of the objective since the last check-in event. Currently we cannot customize the check-in event date, so this is basically the progress increase (in percentage) since last friday',
  })
  public progressIncreaseSinceLastCheckInEvent: number

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

  public id: string
  public policies: PolicyObject
}
