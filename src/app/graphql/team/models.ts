import { Field, Float, ID, ObjectType } from '@nestjs/graphql'

import { CompanyObject } from 'app/graphql/company/models'
import { KeyResultObject } from 'app/graphql/key-result/models'
import { ConfidenceReportObject } from 'app/graphql/key-result/report/confidence'
import { ProgressReportObject } from 'app/graphql/key-result/report/progress'
import { UserObject } from 'app/graphql/user/models'

@ObjectType('Team', { description: 'A collection of users for a given company' })
export class TeamObject {
  @Field(() => ID, { description: 'The ID of the team' })
  id: number

  @Field({ description: 'The name of the team' })
  name: string

  @Field({ nullable: true, description: 'The description about the team' })
  description?: string

  @Field({ description: 'The creation date of the team' })
  createdAt: Date

  @Field({ description: 'The last update date of the team' })
  updatedAt: Date

  @Field(() => [KeyResultObject], {
    description: 'The creation date ordered list of key results that belongs to that team',
  })
  keyResults: KeyResultObject[]

  @Field(() => ID, { description: 'The company ID that owns this team' })
  companyId: CompanyObject['id']

  @Field(() => CompanyObject, { description: 'The company that owns this team' })
  company: CompanyObject

  @Field(() => [UserObject], {
    description: 'A creation date ordered list of users that are members of this team',
  })
  users: UserObject[]

  @Field(() => ID, { description: 'The user ID that owns this team' })
  ownerId: UserObject['id']

  @Field(() => CompanyObject, { description: 'The user that owns this team' })
  owner: UserObject

  @Field(() => ID, { description: 'The ID of the team that owns this team', nullable: true })
  parentTeamId: TeamObject['id']

  @Field(() => TeamObject, { description: 'The team that owns this team', nullable: true })
  parentTeam: TeamObject

  @Field(() => [TeamObject], { description: 'A list of teams that belongs to this team' })
  teams: TeamObject[]

  @Field(() => Float, {
    description: 'The computed percentage current progress of this team',
    nullable: true,
  })
  currentProgress: ProgressReportObject['valueNew']

  @Field(() => Float, {
    description: 'The computed current confidence of this team',
    nullable: true,
  })
  currentConfidence: ConfidenceReportObject['valueNew']
}
