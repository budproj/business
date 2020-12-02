import { Field, ID, ObjectType } from '@nestjs/graphql'

import { CycleObject } from 'app/graphql/cycle/models'
import { KeyResultObject } from 'app/graphql/key-result/models'

@ObjectType()
export class ObjectiveObject {
  @Field(() => ID)
  id: number

  @Field()
  title: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => [KeyResultObject])
  keyResults: KeyResultObject[]

  @Field(() => ID)
  cycleId: CycleObject['id']

  @Field(() => CycleObject)
  cycle: CycleObject
}
