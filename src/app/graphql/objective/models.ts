import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Cycle } from 'app/graphql/cycle/models'
import { KeyResult } from 'app/graphql/key-result/models'

@ObjectType()
export class Objective {
  @Field(() => Int)
  id: number

  @Field()
  title: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => [KeyResult])
  keyResults: KeyResult[]

  @Field(() => Cycle)
  cycle: Cycle[]
}
