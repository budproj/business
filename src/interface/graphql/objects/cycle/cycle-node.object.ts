import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Cadence } from '@core/modules/cycle/enums/cadence.enum'

import { CadenceGraphQLEnum } from '../../enums/cadence.enum'
import { NodeGraphQLInterface } from '../../interfaces/node.interface'
import { PolicyGraphQLObject } from '../authorization/policy.object'
import { KeyResultNodeGraphQLObject } from '../key-result/key-result-node.object'
import { ObjectiveNodeGraphQLObject } from '../objetive/objective-node.object'
import { TeamNodeGraphQLObject } from '../team/team-node.object'

@ObjectType('Cycle', {
  implements: () => NodeGraphQLInterface,
  description:
    'A collection of users. It can be either inside another team, or a root team (a.k.a. company)',
})
export class CycleNodeGraphQLObject implements NodeGraphQLInterface {
  @Field({ complexity: 0, description: 'The period of the cycle' })
  public period: string

  @Field(() => CadenceGraphQLEnum, {
    complexity: 0,
    description:
      'The candence of this cycle. Cadence is the frequency at which previous objectives have to be grade and new ones created.',
  })
  public cadence: Cadence

  @Field({
    complexity: 0,
    description: 'This flag defines if objectives related to this cycle can be updated',
  })
  public active: boolean

  @Field({ complexity: 0, description: 'The date that this cycle starts' })
  public dateStart: Date

  @Field({ complexity: 0, description: 'The date that this cycle ends' })
  public dateEnd: Date

  @Field({ complexity: 0, description: 'The last update date of this cycle' })
  public updatedAt: Date

  @Field(() => ID, { complexity: 0, description: 'The team ID that this cycle belongs to' })
  public teamId: TeamNodeGraphQLObject['id']

  @Field(() => ID, {
    complexity: 0,
    nullable: true,
    description:
      'Each cycle can relates with a given higher cycle, creating a for of tree-like architecture. If this cycle has any cycle above it, the ID of that will be recorded here',
  })
  public parentId?: CycleNodeGraphQLObject['id']

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => TeamNodeGraphQLObject, {
    complexity: 1,
    description: 'The team that this cycle belongs to',
  })
  public team: TeamNodeGraphQLObject

  @Field(() => CycleNodeGraphQLObject, {
    complexity: 1,
    nullable: true,
    description:
      'Each cycle can relates with a given higher cycle, creating a for of tree-like architecture. If this cycle has any cycle above it, that one will be recorded here',
  })
  public parent?: CycleNodeGraphQLObject

  // **********************************************************************************************
  // EDGE FIELDS
  // **********************************************************************************************

  @Field(() => [CycleNodeGraphQLObject], {
    complexity: 0,
    nullable: true,
    description:
      'Each cycle can have multiple cycles below it. If this cycle has any cycle inside of it, those will be listed here',
  })
  public cycles?: CycleNodeGraphQLObject[]

  @Field(() => [ObjectiveNodeGraphQLObject], {
    complexity: 0,
    nullable: true,
    description: 'The objectives inside this cycle',
  })
  public objectives?: ObjectiveNodeGraphQLObject[]

  @Field(() => [KeyResultNodeGraphQLObject], {
    complexity: 0,
    nullable: true,
    description: 'The key-results from this cycle',
  })
  public keyResults?: KeyResultNodeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public id: string
  public createdAt: Date
  public policies?: PolicyGraphQLObject
}
