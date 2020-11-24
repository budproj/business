import { Field, Int, ObjectType } from '@nestjs/graphql'

import { User } from 'app/user/models'

@ObjectType()
export class KeyResult {
  @Field(() => Int)
  id: number

  @Field()
  title: string

  @Field({ nullable: true })
  description?: string

  @Field(() => Int)
  initialValue: number

  @Field(() => Int)
  goal: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => User)
  owner: User
}
