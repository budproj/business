import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Cycle } from 'app/graphql/cycle/models'
import { Team } from 'app/graphql/team/models'

@ObjectType()
export class Company {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => [Team])
  teams: Team[]

  @Field(() => [Cycle])
  cycles: Cycle[]
}
