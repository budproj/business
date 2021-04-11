import { Field, ObjectType } from '@nestjs/graphql'

import { UserGender } from '@core/modules/user/enums/user-gender.enum'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-node.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { UserGenderGraphQLEnum } from '@interface/graphql/enums/user-gender.enum'

import { NodeRelayInterface } from '../../relay/interfaces/node.interface'

import { UserKeyResultCheckInsGraphQLConnection } from './user-key-result-check-ins.connection'
import { UserKeyResultCommentsGraphQLConnection } from './user-key-result-comments.connection'
import { UserKeyResultsGraphQLConnection } from './user-key-results.connection'
import { UserObjectivesGraphQLConnection } from './user-objectives.connection'
import { UserTeamsGraphQLConnection } from './user-teams.connection'

@ObjectType('User', {
  implements: () => [NodeRelayInterface, GuardedNodeGraphQLInterface],
  description:
    'User is an entity inside a given root team (a.k.a. company). It is associated with many teams, progress reports, and others.',
})
export class UserGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field({ complexity: 0, description: 'The name of the user' })
  public readonly firstName!: string

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
    description:
      'A description for that user. A more detailed information where the user tells about her/himself',
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

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
  public readonly policy?: PolicyGraphQLObject
}
