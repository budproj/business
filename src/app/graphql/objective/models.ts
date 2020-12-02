import { Field, Int, ObjectType } from '@nestjs/graphql'

import { CycleObject } from 'app/graphql/cycle/models'
import { KeyResultObject } from 'app/graphql/key-result/models'

@ObjectType()
export class ObjectiveObject {
  @Field(() => Int)
  id: number

  @Field()
  title: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => [KeyResultObject])
  keyResults: KeyResultObject[]

  @Field(() => CycleObject)
  cycle: CycleObject
}
