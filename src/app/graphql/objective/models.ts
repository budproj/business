import { Field, ID, ObjectType } from '@nestjs/graphql'

import { CycleObject } from 'app/graphql/cycle/models'
import { KeyResultObject } from 'app/graphql/key-result/models'
import { UserObject } from 'app/graphql/user/models'

@ObjectType('Objective', { description: 'A group of key results that has the same focus' })
export class ObjectiveObject {
  @Field(() => ID, { description: 'The ID of the objective' })
  id: number

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
}
