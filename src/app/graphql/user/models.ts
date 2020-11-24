import { Field, Int, ObjectType } from '@nestjs/graphql'

import { KeyResult } from 'app/graphql/key-result/models'

@ObjectType()
export class User {
  @Field(() => Int)
  id: number

  @Field()
  authzSub: string

  @Field({ nullable: true })
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
