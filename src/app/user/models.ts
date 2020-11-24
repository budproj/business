import { Field, Int, ObjectType } from '@nestjs/graphql'

import { KeyResult } from 'app/key-result/models'

@ObjectType()
export class User {
  @Field(() => Int)
  id: number

  @Field()
  authzSub: string

  @Field()
  role: string

  @Field({ nullable: true })
  picture: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => [KeyResult])
  keyResults: KeyResult[]
}
