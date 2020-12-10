import { Field, ID, ObjectType } from '@nestjs/graphql'

import { CycleObject } from 'app/graphql/cycle/models'
import { TeamObject } from 'app/graphql/team/models'
import { UserObject } from 'app/graphql/user/models'

@ObjectType('Company', { description: 'A group of teams that has a given stakeholder' })
export class CompanyObject {
  @Field(() => ID, { description: 'The ID of the company' })
  id: number

  @Field({ description: 'The name of the company' })
  name: string

  @Field({ description: 'The creation date of the company' })
  createdAt: Date

  @Field({ description: 'The last update date of the company' })
  updatedAt: Date

  @Field(() => [TeamObject], { description: 'The teams that belongs to this company' })
  teams: TeamObject[]

  @Field(() => [CycleObject], { description: 'The cycles that belongs to this company' })
  cycles: CycleObject[]

  @Field(() => ID, { description: 'The user ID that this company belongs to' })
  ownerId: UserObject['id']

  @Field(() => UserObject, { description: 'The user that this company belongs to' })
  owner: UserObject
}
