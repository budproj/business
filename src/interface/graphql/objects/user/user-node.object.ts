import { Field, ObjectType } from '@nestjs/graphql'

import { UserGender } from '@core/modules/user/enums/user-gender.enum'
import { UserGenderGraphQLEnum } from '@interface/graphql/enums/user-gender.enum'
import { NodeGraphQLInterface } from '@interface/graphql/interfaces/node.interface'
import { PolicyGraphQLObject } from '@interface/graphql/objects/authorization/policy.object'
import { KeyResultNodeGraphQLObject } from '@interface/graphql/objects/key-result/key-result-node.object'
import { ObjectiveNodeGraphQLObject } from '@interface/graphql/objects/objetive/objective-node.object'
import { TeamNodeGraphQLObject } from '@interface/graphql/objects/team/team-node.object'

@ObjectType('User', {
  implements: () => NodeGraphQLInterface,
  description:
    'User is an entity inside a given root team (a.k.a. company). It is associated with many teams, progress reports, and others.',
})
export class UserNodeGraphQLObject implements NodeGraphQLInterface {
  @Field({ description: 'The name of the user' })
  public firstName: string

  @Field({ description: 'The sub field in Auth0 (their ID)' })
  public authzSub: string

  @Field({ description: 'The last update date of this user' })
  public updatedAt: Date

  @Field({ description: 'The full name of the user' })
  public fullName?: string

  @Field({ description: 'The last name of the user', nullable: true })
  public lastName?: string

  @Field(() => UserGenderGraphQLEnum, { description: 'The gender of the user', nullable: true })
  public gender?: UserGender

  @Field({ description: 'The user role in the company', nullable: true })
  public role?: string

  @Field({ description: 'The picture of the user', nullable: true })
  public picture?: string

  @Field(() => String, {
    description: 'The custom nickname that user wants to be called',
    nullable: true,
  })
  public nickname?: string

  @Field(() => String, {
    description:
      'A description for that user. A more detailed information where the user tells about her/himself',
    nullable: true,
  })
  public about?: string

  @Field(() => String, {
    description: "The URL for the user's LinkedIn profile",
    nullable: true,
  })
  public linkedInProfileAddress?: string

  @Field(() => [TeamNodeGraphQLObject], {
    description: 'The creation date ordered list of companies that this user is a part of',
    nullable: true,
  })
  public companies?: TeamNodeGraphQLObject[]

  @Field(() => [TeamNodeGraphQLObject], {
    description: 'The creation date ordered list of teams that this user is part of',
    nullable: true,
  })
  public teams?: Promise<TeamNodeGraphQLObject[]>

  @Field(() => [TeamNodeGraphQLObject], {
    description: 'The creation date ordered list of teams that this user owns',
    nullable: true,
  })
  public ownedTeams?: TeamNodeGraphQLObject[]

  @Field(() => [ObjectiveNodeGraphQLObject], {
    description: 'The creation date ordered list of objectives that this user owns',
    nullable: true,
  })
  public objectives?: ObjectiveNodeGraphQLObject[]

  @Field(() => [KeyResultNodeGraphQLObject], {
    description: 'The creation date ordered list of key results that this user owns',
    nullable: true,
  })
  public keyResults?: KeyResultNodeGraphQLObject[]

  public id: string
  public createdAt: Date
  public policies?: PolicyGraphQLObject
}
