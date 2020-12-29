import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { CycleObject } from 'app/graphql/cycle/models'
import { ConfidenceReportObject } from 'app/graphql/key-result/report/confidence'
import { ProgressReportObject } from 'app/graphql/key-result/report/progress'
import { TeamObject } from 'app/graphql/team/models'
import { UserObject } from 'app/graphql/user/models'
import { COMPANY_GENDER } from 'domain/company/constants'

registerEnumType(COMPANY_GENDER, {
  name: 'COMPANY_GENDER',
  description: 'Each gender represents a possible gender option for our companies',
})

@ObjectType('Company', { description: 'A group of teams that has a given stakeholder' })
export class CompanyObject {
  @Field(() => ID, { description: 'The ID of the company' })
  id: string

  @Field({ description: 'The name of the company' })
  name: string

  @Field({ nullable: true, description: 'The gender of the company' })
  gender?: COMPANY_GENDER

  @Field({ description: 'The description of the company', nullable: true })
  description?: string

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

  @Field(() => Float, {
    description: 'The computed percentage current progress of this company',
    nullable: true,
  })
  currentProgress: ProgressReportObject['valueNew']

  @Field(() => Float, {
    description: 'The computed current confidence of this company',
    nullable: true,
  })
  currentConfidence: ConfidenceReportObject['valueNew']

  @Field(() => [UserObject], {
    description: 'A creation date ordered list of users that are members of this company',
  })
  users: UserObject[]
}
