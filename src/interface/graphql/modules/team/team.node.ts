import { Field, Float, ID, ObjectType } from '@nestjs/graphql'

import { TeamGender } from '@core/modules/team/enums/team-gender.enum'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-node.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/modules/key-result/check-in/key-result-check-in.node'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { NodeRelayInterface } from '@interface/graphql/relay/interfaces/node.interface'

import { TeamCyclesGraphQLConnection } from './connections/team-cycles/team-cycles.connection'
import { TeamKeyResultsGraphQLConnection } from './connections/team-key-results/team-key-results.connection'
import { TeamObjectivesGraphQLConnection } from './connections/team-objectives/team-objectives.connection'
import { TeamTeamsGraphQLConnection } from './connections/team-teams/team-teams.connection'
import { TeamUsersGraphQLConnection } from './connections/team-users/team-users.connection'
import { TeamGenderGraphQLEnum } from './enums/team-gender.enum'
import { TeamStatusObject } from './objects/team-status.object'

@ObjectType('Team', {
  implements: () => [NodeRelayInterface, GuardedNodeGraphQLInterface],
  description:
    'A collection of users. It can be either inside another team, or a root team (a.k.a. company)',
})
export class TeamGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field({ complexity: 0, description: 'The name of the team' })
  public readonly name!: string

  @Field({ complexity: 0, description: 'The last update date of the team' })
  public readonly updatedAt!: Date

  @Field(() => ID, { complexity: 0, description: 'The user ID that owns this team' })
  public readonly ownerId!: string

  @Field({ complexity: 0, nullable: true, description: 'The description about the team' })
  public readonly description?: string

  @Field(() => TeamGenderGraphQLEnum, {
    complexity: 0,
    nullable: true,
    description: 'The gender of the team',
  })
  public readonly gender?: TeamGender

  @Field(() => ID, {
    complexity: 0,
    description: 'The ID of the team that owns this team',
    nullable: true,
  })
  public readonly parentId?: string

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => TeamStatusObject, {
    description:
      'The status of the given team. Here you can fetch the current progress, confidence, and others for that team',
  })
  public status: TeamStatusObject

  @Field(() => Float, {
    description:
      'The percentage progress increase of the objective since the last week. We consider a week as a "business" week, considering it starting on saturday and ending on friday',
  })
  public progressIncreaseSinceLastWeek!: number

  @Field(() => UserGraphQLNode, {
    complexity: 1,
    description: 'The user that owns this team',
  })
  public readonly owner!: UserGraphQLNode

  @Field({ complexity: 1, description: 'Defines if the team is a company' })
  public readonly isCompany?: boolean

  @Field(() => TeamGraphQLNode, {
    complexity: 1,
    nullable: true,
    description: 'The team that is the company of this team. This is also known as "rootTeam"',
  })
  public readonly company?: TeamGraphQLNode

  @Field(() => TeamGraphQLNode, {
    complexity: 1,
    nullable: true,
    description: 'The team that owns this team',
  })
  public readonly parent?: TeamGraphQLNode

  @Field(() => KeyResultCheckInGraphQLNode, {
    description: 'The latest key result check-in for this team',
    nullable: true,
  })
  public latestKeyResultCheckIn?: KeyResultCheckInGraphQLNode

  // **********************************************************************************************
  // CONNECTION FIELDS
  // **********************************************************************************************

  @Field(() => TeamUsersGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'A creation date ordered list of users that are members of this team',
  })
  public readonly users?: TeamUsersGraphQLConnection

  @Field(() => TeamTeamsGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'A list of teams that belongs to this team',
  })
  public readonly teams?: TeamTeamsGraphQLConnection

  @Field(() => TeamTeamsGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: "A list with all teams inside this team's tree ordered by their progress",
  })
  public readonly rankedTeams?: TeamTeamsGraphQLConnection

  @Field(() => TeamCyclesGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'The cycles that belongs to this team',
  })
  public readonly cycles?: TeamCyclesGraphQLConnection

  @Field(() => TeamObjectivesGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'The objectives that belongs to this team',
  })
  public readonly objectives?: TeamObjectivesGraphQLConnection

  @Field(() => TeamKeyResultsGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'The creation date ordered list of key results that belongs to that team',
  })
  public readonly keyResults?: TeamKeyResultsGraphQLConnection

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
  public readonly policy?: PolicyGraphQLObject
}
