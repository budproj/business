import { Field, ID, ObjectType } from '@nestjs/graphql'

import { TeamGender } from '@core/modules/team/enums/team-gender.enum'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-node.interface'
import { NodePolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/node-policy.object'
import { NodeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/node.interface'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { DeltaGraphQLObject } from '@interface/graphql/objects/delta.object'
import { StatusGraphQLObject } from '@interface/graphql/objects/status.object'

import { TeamCyclesGraphQLConnection } from './connections/team-cycles/team-cycles.connection'
import { TeamKeyResultsGraphQLConnection } from './connections/team-key-results/team-key-results.connection'
import { TeamObjectivesGraphQLConnection } from './connections/team-objectives/team-objectives.connection'
import { TeamTeamsGraphQLConnection } from './connections/team-teams/team-teams.connection'
import { TeamUsersGraphQLConnection } from './connections/team-users/team-users.connection'
import { TeamGenderGraphQLEnum } from './enums/team-gender.enum'

@ObjectType('Team', {
  implements: () => [NodeRelayGraphQLInterface, GuardedNodeGraphQLInterface],
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

  @Field(() => StatusGraphQLObject, {
    description:
      'The status of the given team. Here you can fetch the current progress, confidence, and others for that team',
  })
  public status: StatusGraphQLObject

  @Field(() => DeltaGraphQLObject, {
    complexity: 2,
    description: 'The delta of this team comparing with last week',
  })
  public delta!: DeltaGraphQLObject

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
  public readonly policy?: NodePolicyGraphQLObject
}
