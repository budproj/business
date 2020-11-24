import { Field, Int, ObjectType } from '@nestjs/graphql'

import { KeyResult } from 'app/graphql/key-result/models'

@ObjectType()
export class Team {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => [KeyResult])
  keyResults: KeyResult[]
}
