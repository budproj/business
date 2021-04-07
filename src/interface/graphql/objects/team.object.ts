import { Field, ID, ObjectType } from '@nestjs/graphql'

import { TeamGender } from '@core/modules/team/enums/team-gender.enum'
import { NodeGraphQLInterface } from '@interface/graphql/interfaces/node.interface'

import { TeamGenderGraphQLEnum } from '../enums/team-gender.enum'

import { PolicyGraphQLObject } from './policy.object'
import { UserNodeGraphQLObject } from './user-node.object'

@ObjectType('Team', {
  implements: () => NodeGraphQLInterface,
  description:
    'A collection of users. It can be either inside another team, or a root team (a.k.a. company)',
})
export class TeamGraphQLObject implements NodeGraphQLInterface {
  @Field({ description: 'The name of the team' })
  public name: string

  @Field({ description: 'Defines if the team is a company' })
  public isCompany: boolean

  @Field({ description: 'The last update date of the team' })
  public updatedAt: Date

  @Field(() => ID, { description: 'The user ID that owns this team' })
  public ownerId: UserNodeGraphQLObject['id']

  @Field(() => UserNodeGraphQLObject, { description: 'The user that owns this team' })
  public owner: UserNodeGraphQLObject

  @Field({ nullable: true, description: 'The description about the team' })
  public description?: string

  @Field(() => TeamGenderGraphQLEnum, { nullable: true, description: 'The gender of the team' })
  public gender?: TeamGender

  @Field(() => TeamGraphQLObject, {
    description: 'The team that is the company of this team. This is also known as "rootTeam"',
    nullable: true,
  })
  public company?: TeamGraphQLObject

  @Field(() => ID, { description: 'The ID of the team that owns this team', nullable: true })
  public parentId?: TeamGraphQLObject['id']

  @Field(() => TeamGraphQLObject, { description: 'The team that owns this team', nullable: true })
  public parent?: TeamGraphQLObject

  @Field(() => [UserNodeGraphQLObject], {
    description: 'A creation date ordered list of users that are members of this team',
    nullable: true,
  })
  public users?: UserNodeGraphQLObject[]

  @Field(() => [TeamGraphQLObject], {
    description: 'A list of teams that belongs to this team',
    nullable: true,
  })
  public teams?: TeamGraphQLObject[]

  @Field(() => [TeamGraphQLObject], {
    description: "A list with all teams inside this team's tree ordered by their progress",
    nullable: true,
  })
  public teamsRanking?: TeamGraphQLObject[]

  public id: string
  public createdAt: Date
  public policies?: PolicyGraphQLObject
}
