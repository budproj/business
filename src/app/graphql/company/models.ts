import { Field, Int, ObjectType } from '@nestjs/graphql'

import { CycleObject } from 'app/graphql/cycle/models'
import { TeamObject } from 'app/graphql/team/models'

@ObjectType()
export class CompanyObject {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => [TeamObject])
  teams: TeamObject[]

  @Field(() => [CycleObject])
  cycles: CycleObject[]
}
