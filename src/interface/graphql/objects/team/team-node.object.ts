import { Field, ID, ObjectType } from '@nestjs/graphql'

import { TeamGender } from '@core/modules/team/enums/team-gender.enum'

import { TeamGenderGraphQLEnum } from '../../enums/team-gender.enum'
import { NodeGraphQLInterface } from '../../interfaces/node.interface'
import { PolicyGraphQLObject } from '../authorization/policy.object'
import { CycleNodeGraphQLObject } from '../cycle/cycle-node.object'
import { KeyResultNodeGraphQLObject } from '../key-result/key-result-node.object'
import { UserNodeGraphQLObject } from '../user/user-node.object'

@ObjectType('Team', {
  implements: () => NodeGraphQLInterface,
  description:
    'A collection of users. It can be either inside another team, or a root team (a.k.a. company)',
})
export class TeamNodeGraphQLObject implements NodeGraphQLInterface {
  @Field({ complexity: 0, description: 'The name of the team' })
  public name: string

  @Field({ complexity: 0, description: 'The last update date of the team' })
  public updatedAt: Date

  @Field(() => ID, { complexity: 0, description: 'The user ID that owns this team' })
  public ownerId: UserNodeGraphQLObject['id']

  @Field({ complexity: 0, nullable: true, description: 'The description about the team' })
  public description?: string

  @Field(() => TeamGenderGraphQLEnum, {
    complexity: 0,
    nullable: true,
    description: 'The gender of the team',
  })
  public gender?: TeamGender

  @Field(() => ID, {
    complexity: 0,
    description: 'The ID of the team that owns this team',
    nullable: true,
  })
  public parentId?: TeamNodeGraphQLObject['id']

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => UserNodeGraphQLObject, {
    complexity: 1,
    description: 'The user that owns this team',
  })
  public owner: UserNodeGraphQLObject

  @Field({ complexity: 1, description: 'Defines if the team is a company' })
  public isCompany?: boolean

  @Field(() => TeamNodeGraphQLObject, {
    complexity: 1,
    nullable: true,
    description: 'The team that is the company of this team. This is also known as "rootTeam"',
  })
  public company?: TeamNodeGraphQLObject

  @Field(() => TeamNodeGraphQLObject, {
    complexity: 1,
    nullable: true,
    description: 'The team that owns this team',
  })
  public parent?: TeamNodeGraphQLObject

  // **********************************************************************************************
  // EDGE FIELDS
  // **********************************************************************************************

  @Field(() => [UserNodeGraphQLObject], {
    complexity: 0,
    nullable: true,
    description: 'A creation date ordered list of users that are members of this team',
  })
  public users?: Promise<UserNodeGraphQLObject[]>

  @Field(() => [TeamNodeGraphQLObject], {
    complexity: 0,
    nullable: true,
    description: 'A list of teams that belongs to this team',
  })
  public teams?: TeamNodeGraphQLObject[]

  @Field(() => [TeamNodeGraphQLObject], {
    complexity: 0,
    nullable: true,
    description: "A list with all teams inside this team's tree ordered by their progress",
  })
  public rankedTeams?: TeamNodeGraphQLObject[]

  @Field(() => [CycleNodeGraphQLObject], {
    complexity: 0,
    nullable: true,
    description: 'The cycles that belongs to this team',
  })
  public cycles?: CycleNodeGraphQLObject[]

  @Field(() => [KeyResultNodeGraphQLObject], {
    complexity: 0,
    nullable: true,
    description: 'The creation date ordered list of key results that belongs to that team',
  })
  public keyResults?: KeyResultNodeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public id: string
  public createdAt: Date
  public policies?: PolicyGraphQLObject
}
