import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Objective } from 'app/graphql/objective/models'
import { Team } from 'app/graphql/team/models'
import { User } from 'app/graphql/user/models'

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

  @Field(() => Objective)
  objective: Objective

  @Field(() => Team)
  team: Team
}
