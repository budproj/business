import { Field, ID, ObjectType } from '@nestjs/graphql'

import { TeamGender } from '@core/modules/team/enums/team-gender.enum'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-node.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { TeamGenderGraphQLEnum } from '@interface/graphql/enums/team-gender.enum'

import { CycleGraphQLNode } from '../cycle/cycle.node'
import { KeyResultGraphQLNode } from '../key-result/key-result.node'
import { UserGraphQLNode } from '../user/user.node'

@ObjectType('Team', {
  implements: () => GuardedNodeGraphQLInterface,
  description:
    'A collection of users. It can be either inside another team, or a root team (a.k.a. company)',
})
export class TeamGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field({ complexity: 0, description: 'The name of the team' })
  public name!: string

  @Field({ complexity: 0, description: 'The last update date of the team' })
  public updatedAt!: Date

  @Field(() => ID, { complexity: 0, description: 'The user ID that owns this team' })
  public ownerId!: UserGraphQLNode['id']

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
  public parentId?: TeamGraphQLNode['id']

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => UserGraphQLNode, {
    complexity: 1,
    description: 'The user that owns this team',
  })
  public owner!: UserGraphQLNode

  @Field({ complexity: 1, description: 'Defines if the team is a company' })
  public isCompany?: boolean

  @Field(() => TeamGraphQLNode, {
    complexity: 1,
    nullable: true,
    description: 'The team that is the company of this team. This is also known as "rootTeam"',
  })
  public company?: TeamGraphQLNode

  @Field(() => TeamGraphQLNode, {
    complexity: 1,
    nullable: true,
    description: 'The team that owns this team',
  })
  public parent?: TeamGraphQLNode

  // **********************************************************************************************
  // EDGE FIELDS
  // **********************************************************************************************

  @Field(() => [UserGraphQLNode], {
    complexity: 0,
    nullable: true,
    description: 'A creation date ordered list of users that are members of this team',
  })
  public users?: Promise<UserGraphQLNode[]>

  @Field(() => [TeamGraphQLNode], {
    complexity: 0,
    nullable: true,
    description: 'A list of teams that belongs to this team',
  })
  public teams?: TeamGraphQLNode[]

  @Field(() => [TeamGraphQLNode], {
    complexity: 0,
    nullable: true,
    description: "A list with all teams inside this team's tree ordered by their progress",
  })
  public rankedTeams?: TeamGraphQLNode[]

  @Field(() => [CycleGraphQLNode], {
    complexity: 0,
    nullable: true,
    description: 'The cycles that belongs to this team',
  })
  public cycles?: CycleGraphQLNode[]

  @Field(() => [KeyResultGraphQLNode], {
    complexity: 0,
    nullable: true,
    description: 'The creation date ordered list of key results that belongs to that team',
  })
  public keyResults?: KeyResultGraphQLNode[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public id!: string
  public createdAt!: Date
  public policies?: PolicyGraphQLObject
}
