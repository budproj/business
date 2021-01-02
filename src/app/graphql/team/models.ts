import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { CycleObject } from 'app/graphql/cycle/models'
import { KeyResultObject } from 'app/graphql/key-result/models'
import { ConfidenceReportObject } from 'app/graphql/key-result/report/confidence'
import { ProgressReportObject } from 'app/graphql/key-result/report/progress'
import { ObjectiveObject } from 'app/graphql/objective/models'
import { UserObject } from 'app/graphql/user/models'
import { TEAM_GENDER } from 'domain/team/constants'

registerEnumType(TEAM_GENDER, {
  name: 'TEAM_GENDER',
  description: 'Each gender represents a possible gender option for our teams',
})

@ObjectType('Team', {
  description:
    'A collection of users. It can be either inside another team, or a root team (a.k.a. company)',
})
export class TeamObject {
  @Field(() => ID, { description: 'The ID of the team' })
  id: string

  @Field({ description: 'The name of the team' })
  name: string

  @Field({ nullable: true, description: 'The description about the team' })
  description?: string

  @Field({ nullable: true, description: 'The gender of the team' })
  gender?: TEAM_GENDER

  @Field({ description: 'The creation date of the team' })
  createdAt: Date

  @Field({ description: 'The last update date of the team' })
  updatedAt: Date

  @Field(() => [KeyResultObject], {
    description: 'The creation date ordered list of key results that belongs to that team',
  })
  keyResults: KeyResultObject[]

  @Field(() => [UserObject], {
    description: 'A creation date ordered list of users that are members of this team',
  })
  users: UserObject[]

  @Field(() => ID, { description: 'The user ID that owns this team' })
  ownerId: UserObject['id']

  @Field(() => UserObject, { description: 'The user that owns this team' })
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

  @Field(() => [ObjectiveObject], {
    nullable: true,
    description: 'The created ordered list of objectives in this team',
  })
  objectives: ObjectiveObject[]

  @Field(() => [CycleObject], { description: 'The cycles that belongs to this team' })
  cycles: CycleObject[]

  @Field(() => TeamObject, {
    description: 'The team that is the company of this team. This is also known as "rootTeam"',
  })
  company: TeamObject

  @Field(() => Float, {
    description: 'The percentage progress increase of the team since last monday',
  })
  percentageProgressIncrease: number
}
