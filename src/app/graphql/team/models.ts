import { Field, Float, ID, ArgsType, ObjectType, registerEnumType } from '@nestjs/graphql'

import { PolicyObject } from 'src/app/graphql/authz/models'
import { CycleObject } from 'src/app/graphql/cycle/models'
import { KeyResultCheckInObject } from 'src/app/graphql/key-result/check-in/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { EntityObject, StatusObject } from 'src/app/graphql/models'
import { ObjectiveObject, ObjectiveStatusObject } from 'src/app/graphql/objective/models'
import { UserObject } from 'src/app/graphql/user/models'
import { TEAM_GENDER } from 'src/domain/team/constants'

registerEnumType(TEAM_GENDER, {
  name: 'TEAM_GENDER',
  description: 'Each gender represents a possible gender option for our teams',
})

@ObjectType('TeamStatus', {
  implements: () => StatusObject,
  description:
    "The current status of this team. By status we mean progress, confidence, and other reported values from it's objectives and their child team's objectives",
})
export class TeamStatusObject implements StatusObject {
  @Field(() => ObjectiveStatusObject, {
    description:
      "The most recent objective status update inside among all objectives for this team and it's child teams",
    nullable: true,
  })
  public latestObjectiveStatus?: ObjectiveStatusObject

  public progress: number
  public confidence: number
}

@ObjectType('Team', {
  implements: () => EntityObject,
  description:
    'A collection of users. It can be either inside another team, or a root team (a.k.a. company)',
})
export class TeamObject implements EntityObject {
  @Field({ description: 'The name of the team' })
  public name: string

  @Field(() => Boolean, { description: 'Defines if the team is a company' })
  public isCompany: boolean

  @Field(() => Float, {
    description:
      'The percentage progress increase of the objective since the last week. We consider a week as a "business" week, considering it starting on saturday and ending on friday',
  })
  public progressIncreaseSinceLastWeek: number

  @Field({ description: 'The creation date of the team' })
  public createdAt: Date

  @Field({ description: 'The last update date of the team' })
  public updatedAt: Date

  @Field(() => ID, { description: 'The user ID that owns this team' })
  public ownerId: UserObject['id']

  @Field(() => UserObject, { description: 'The user that owns this team' })
  public owner: UserObject

  @Field({ nullable: true, description: 'The description about the team' })
  public description?: string

  @Field({ nullable: true, description: 'The gender of the team' })
  public gender?: TEAM_GENDER

  @Field(() => TeamObject, {
    description: 'The team that is the company of this team. This is also known as "rootTeam"',
    nullable: true,
  })
  public company?: TeamObject

  @Field(() => ID, { description: 'The ID of the team that owns this team', nullable: true })
  public parentTeamId?: TeamObject['id']

  @Field(() => TeamObject, { description: 'The team that owns this team', nullable: true })
  public parentTeam?: TeamObject

  @Field(() => [UserObject], {
    description: 'A creation date ordered list of users that are members of this team',
    nullable: true,
  })
  public users?: UserObject[]

  @Field(() => [TeamObject], {
    description: 'A list of teams that belongs to this team',
    nullable: true,
  })
  public teams?: TeamObject[]

  @Field(() => [TeamObject], {
    description: "A list with all teams inside this team's tree ordered by their progress",
    nullable: true,
  })
  public teamsRanking?: TeamObject[]

  @Field(() => [CycleObject], {
    description: 'The cycles that belongs to this team',
    nullable: true,
  })
  public cycles?: CycleObject[]

  @Field(() => [ObjectiveObject], {
    description: 'The created ordered list of objectives in this team',
    nullable: true,
  })
  public objectives?: ObjectiveObject[]

  @Field(() => [KeyResultObject], {
    description: 'The creation date ordered list of key results that belongs to that team',
    nullable: true,
  })
  public keyResults?: KeyResultObject[]

  @Field(() => KeyResultCheckInObject, {
    description: 'The latest key result check-in for this team',
    nullable: true,
  })
  public latestKeyResultCheckIn?: KeyResultCheckInObject

  @Field(() => TeamStatusObject, {
    description:
      'The status of the given team. Here you can fetch the current progress, confidence, and others for that team',
  })
  public status: TeamStatusObject

  public id: string
  public policies: PolicyObject
}

@ArgsType()
export class TeamFilterArguments {
  @Field(() => ID, {
    description: 'The ID of the parent team that you want to user on this query',
    nullable: true,
  })
  public parentTeamId?: TeamObject['id']

  @Field(() => Boolean, {
    description:
      'A flag that toggles this query to fetch only companies. A company is a team that does not have a parent',
    nullable: true,
  })
  public onlyCompanies?: boolean

  @Field(() => Boolean, {
    description:
      'A flag that toggles this query to fetch only companies and departments. A company is a team that does not have a parent, while a department is a team that has teams inside of it',
    nullable: true,
  })
  public onlyCompaniesAndDepartments?: boolean
}
