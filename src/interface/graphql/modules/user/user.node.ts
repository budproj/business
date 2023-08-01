import { Field, ObjectType } from '@nestjs/graphql'

import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { UserGender } from '@core/modules/user/enums/user-gender.enum'
import { UserStatus } from '@core/modules/user/enums/user-status.enum'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-node.interface'
import { NodePolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/node-policy.object'
import { NodeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/node.interface'
import { UserSettingsGraphQLConnection } from '@interface/graphql/modules/user/connections/user-user-settings/user-user-settings.connection'

import { UserKeyResultCheckInsGraphQLConnection } from './connections/user-key-result-check-ins/user-key-result-check-ins.connection'
import { UserKeyResultCommentsGraphQLConnection } from './connections/user-key-result-comments/user-key-result-comments.connection'
import { UserKeyResultsGraphQLConnection } from './connections/user-key-results/user-key-results.connection'
import { UserObjectivesGraphQLConnection } from './connections/user-objectives/user-objectives.connection'
import { UserTasksGraphQLConnection } from './connections/user-tasks/user-tasks.connection'
import { UserTeamsGraphQLConnection } from './connections/user-teams/user-teams.connection'
import { UserGenderGraphQLEnum } from './enums/user-gender.enum'
import { UserStatusGraphQLEnum } from './enums/user-status.enum'
import { KeyResultCheckInObject } from './objects/user-key-results-check-in.object'
import { UserRoutineObject } from './objects/user-routine.object'

@ObjectType('User', {
  implements: () => [NodeRelayGraphQLInterface, GuardedNodeGraphQLInterface],
  description:
    'User is an entity inside a given root team (a.k.a. company). It is associated with many teams, progress reports, and others.',
})
export class UserGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field({ complexity: 0, description: 'The name of the user' })
  public readonly firstName!: string

  @Field({ complexity: 0, description: 'The user e-mail' })
  public readonly email: string

  @Field(() => UserStatusGraphQLEnum, { complexity: 0, description: 'The status of this user' })
  public readonly status: UserStatus

  @Field({ complexity: 0, description: 'The sub field in Auth0 (their ID)' })
  public readonly authzSub!: string

  @Field({ complexity: 0, description: 'The last update date of this user' })
  public readonly updatedAt!: Date

  @Field({ complexity: 0, nullable: true, description: 'The last name of the user' })
  public readonly lastName?: string

  @Field(() => UserGenderGraphQLEnum, {
    complexity: 0,
    nullable: true,
    description: 'The gender of the user',
  })
  public readonly gender?: UserGender

  @Field({ complexity: 0, nullable: true, description: 'The user role in the company' })
  public readonly role?: string

  @Field({ complexity: 0, nullable: true, description: 'The picture of the user' })
  public readonly picture?: string

  @Field(() => String, {
    complexity: 0,
    nullable: true,
    description: 'The custom nickname that user wants to be called',
  })
  public readonly nickname?: string

  @Field(() => String, {
    complexity: 0,
    nullable: true,
    description: 'A description for that user. A more detailed information where the user tells about her/himself',
  })
  public readonly about?: string

  @Field(() => String, {
    complexity: 0,
    nullable: true,
    description: "The URL for the user's LinkedIn profile",
  })
  public readonly linkedInProfileAddress?: string

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field({ complexity: 1, description: 'The full name of the user' })
  public readonly fullName?: string

  // **********************************************************************************************
  // CONNECTION FIELDS
  // **********************************************************************************************

  @Field(() => UserTeamsGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'The creation date ordered list of companies that this user is a part of',
  })
  public readonly companies?: UserTeamsGraphQLConnection

  @Field(() => UserTeamsGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'The creation date ordered list of teams that this user is part of',
  })
  public readonly teams?: UserTeamsGraphQLConnection

  @Field(() => UserTeamsGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'The creation date ordered list of teams that this user owns',
  })
  public readonly ownedTeams?: UserTeamsGraphQLConnection

  @Field(() => UserObjectivesGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'The creation date ordered list of objectives that this user owns',
  })
  public readonly objectives?: UserObjectivesGraphQLConnection

  @Field(() => UserKeyResultsGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'The creation date ordered list of key results that this user owns',
  })
  public readonly keyResults?: UserKeyResultsGraphQLConnection

  @Field(() => UserKeyResultCommentsGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'The creation date ordered list of key result comments created by this user',
  })
  public readonly keyResultComments?: UserKeyResultCommentsGraphQLConnection

  @Field(() => UserKeyResultCheckInsGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'The creation date ordered list of key result check-ins created by this user',
  })
  public readonly keyResultCheckIns?: UserKeyResultCheckInsGraphQLConnection

  @Field(() => UserTasksGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'A list of tasks that this user has created, ordered by creation date',
  })
  public readonly tasks?: UserTasksGraphQLConnection

  @Field(() => UserSettingsGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'The list of custom settings for the user',
  })
  public readonly settings?: UserSettingsGraphQLConnection

  @Field(() => UserRoutineObject, {
    description: 'The routine that comes from the routines microservice',
    nullable: true,
  })
  public readonly lastRoutine?: UserRoutineObject

  @Field(() => KeyResultCheckInObject, {
    description: 'The routine that comes from the routines microservice',
    nullable: true,
  })
  public readonly latestCheckIn?: KeyResultCheckInInterface

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
  public readonly policy?: NodePolicyGraphQLObject
}
