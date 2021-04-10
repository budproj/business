import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-node.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { CadenceGraphQLEnum } from '@interface/graphql/enums/cadence.enum'

import { KeyResultGraphQLNode } from '../key-result/key-result.node'
import { ObjectiveGraphQLNode } from '../objective/objective.node'
import { TeamGraphQLNode } from '../team/team.node'

@ObjectType('Cycle', {
  implements: () => GuardedNodeGraphQLInterface,
  description:
    'A collection of users. It can be either inside another team, or a root team (a.k.a. company)',
})
export class CycleGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field({ complexity: 0, description: 'The period of the cycle' })
  public period!: string

  @Field(() => CadenceGraphQLEnum, {
    complexity: 0,
    description:
      'The candence of this cycle. Cadence is the frequency at which previous objectives have to be grade and new ones created.',
  })
  public cadence!: Cadence

  @Field({
    complexity: 0,
    description: 'This flag defines if objectives related to this cycle can be updated',
  })
  public active!: boolean

  @Field({ complexity: 0, description: 'The date that this cycle starts' })
  public dateStart!: Date

  @Field({ complexity: 0, description: 'The date that this cycle ends' })
  public dateEnd!: Date

  @Field({ complexity: 0, description: 'The last update date of this cycle' })
  public updatedAt!: Date

  @Field(() => ID, { complexity: 0, description: 'The team ID that this cycle belongs to' })
  public teamId!: TeamGraphQLNode['id']

  @Field(() => ID, {
    complexity: 0,
    nullable: true,
    description:
      'Each cycle can relates with a given higher cycle, creating a for of tree-like architecture. If this cycle has any cycle above it, the ID of that will be recorded here',
  })
  public parentId?: CycleGraphQLNode['id']

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => TeamGraphQLNode, {
    complexity: 1,
    description: 'The team that this cycle belongs to',
  })
  public team!: TeamGraphQLNode

  @Field(() => CycleGraphQLNode, {
    complexity: 1,
    nullable: true,
    description:
      'Each cycle can relates with a given higher cycle, creating a for of tree-like architecture. If this cycle has any cycle above it, that one will be recorded here',
  })
  public parent?: CycleGraphQLNode

  // **********************************************************************************************
  // EDGE FIELDS
  // **********************************************************************************************

  @Field(() => [CycleGraphQLNode], {
    complexity: 0,
    nullable: true,
    description:
      'Each cycle can have multiple cycles below it. If this cycle has any cycle inside of it, those will be listed here',
  })
  public cycles?: CycleGraphQLNode[]

  @Field(() => [ObjectiveGraphQLNode], {
    complexity: 0,
    nullable: true,
    description: 'The objectives inside this cycle',
  })
  public objectives?: ObjectiveGraphQLNode[]

  @Field(() => [KeyResultGraphQLNode], {
    complexity: 0,
    nullable: true,
    description: 'The key-results from this cycle',
  })
  public keyResults?: KeyResultGraphQLNode[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public id!: string
  public createdAt!: Date
  public policies?: PolicyGraphQLObject
}
