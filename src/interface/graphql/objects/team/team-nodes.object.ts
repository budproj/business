import { Field, ID, ObjectType } from '@nestjs/graphql'

import { TeamGender } from '@core/modules/team/enums/team-gender.enum'
import { NodeGraphQLInterface } from '@interface/graphql/interfaces/node.interface'

import { TeamGenderGraphQLEnum } from '../../enums/team-gender.enum'
import { PolicyGraphQLObject } from '../authorization/policy.object'
import { UserNodeGraphQLObject } from '../user/user-node.object'

@ObjectType('Team', {
  implements: () => NodeGraphQLInterface,
  description:
    'A collection of users. It can be either inside another team, or a root team (a.k.a. company)',
})
export class TeamNodeGraphQLObject implements NodeGraphQLInterface {
  @Field({ description: 'The name of the team' })
  public name: string

  @Field({ description: 'The last update date of the team' })
  public updatedAt: Date

  @Field(() => ID, { description: 'The user ID that owns this team' })
  public ownerId: UserNodeGraphQLObject['id']

  @Field(() => UserNodeGraphQLObject, { description: 'The user that owns this team' })
  public owner: UserNodeGraphQLObject

  @Field({ nullable: true, description: 'The description about the team' })
  public description?: string

  @Field({ description: 'Defines if the team is a company' })
  public isCompany?: boolean

  @Field(() => TeamGenderGraphQLEnum, { nullable: true, description: 'The gender of the team' })
  public gender?: TeamGender

  @Field(() => TeamNodeGraphQLObject, {
    description: 'The team that is the company of this team. This is also known as "rootTeam"',
    nullable: true,
  })
  public company?: TeamNodeGraphQLObject

  @Field(() => ID, { description: 'The ID of the team that owns this team', nullable: true })
  public parentId?: TeamNodeGraphQLObject['id']

  @Field(() => TeamNodeGraphQLObject, {
    description: 'The team that owns this team',
    nullable: true,
  })
  public parent?: TeamNodeGraphQLObject

  @Field(() => [UserNodeGraphQLObject], {
    description: 'A creation date ordered list of users that are members of this team',
    nullable: true,
  })
  public users?: UserNodeGraphQLObject[]

  @Field(() => [TeamNodeGraphQLObject], {
    description: 'A list of teams that belongs to this team',
    nullable: true,
  })
  public teams?: TeamNodeGraphQLObject[]

  @Field(() => [TeamNodeGraphQLObject], {
    description: "A list with all teams inside this team's tree ordered by their progress",
    nullable: true,
  })
  public rankedTeams?: TeamNodeGraphQLObject[]

  public id: string
  public createdAt: Date
  public policies?: PolicyGraphQLObject
}
