import { Field, Float, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { CycleObject } from 'src/app/graphql/cycle/models'
import { KeyResultCheckInObject } from 'src/app/graphql/key-result/check-in/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { ObjectiveObject } from 'src/app/graphql/objective/models'
import { UserObject } from 'src/app/graphql/user/models'
import { TEAM_GENDER } from 'src/domain/team/constants'

@ObjectType('Team', {
  description:
    'A collection of users. It can be either inside another team, or a root team (a.k.a. company)',
})
export class TeamObject {
  @Field(() => ID, { description: 'The ID of the team' })
  public id: string

  @Field({ description: 'The name of the team' })
  public name: string

  @Field(() => Boolean, { description: 'Defines if the team is a company' })
  public isCompany: boolean

  @Field(() => Float, {
    description: 'The computed percentage current progress of this team',
  })
  public currentProgress: KeyResultCheckInObject['progress']

  @Field(() => Int, {
    description: 'The computed current confidence of this team',
  })
  public currentConfidence: KeyResultCheckInObject['confidence']

  @Field(() => Float, {
    description: 'The percentage progress increase of the team since last monday',
  })
  public percentageProgressIncrease: number

  @Field({ description: 'The creation date of the team' })
  public createdAt: Date

  @Field({ description: 'The last update date of the team' })
  public updatedAt: Date

  @Field(() => ID, { description: 'The user ID that owns this team' })
  public ownerId: UserObject['id']

  @Field(() => UserObject, { description: 'The user that owns this team' })
  public owner: UserObject

  @Field(() => ID, { description: 'The ID of the team that owns this team', nullable: true })
  public parentTeamId: TeamObject['id']

  @Field(() => TeamObject, { description: 'The team that owns this team', nullable: true })
  public parentTeam: TeamObject

  @Field(() => [UserObject], {
    description: 'A creation date ordered list of users that are members of this team',
  })
  public users: UserObject[]

  @Field(() => [TeamObject], { description: 'A list of teams that belongs to this team' })
  public teams: TeamObject[]

  @Field({ nullable: true, description: 'The description about the team' })
  public description?: string

  @Field({ nullable: true, description: 'The gender of the team' })
  public gender?: TEAM_GENDER

  @Field(() => TeamObject, {
    description: 'The team that is the company of this team. This is also known as "rootTeam"',
    nullable: true,
  })
  public company?: TeamObject

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
}

registerEnumType(TEAM_GENDER, {
  name: 'TEAM_GENDER',
  description: 'Each gender represents a possible gender option for our teams',
})
