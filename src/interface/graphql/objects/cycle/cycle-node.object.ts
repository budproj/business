import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { CadenceGraphQLEnum } from '@interface/graphql/enums/cadence.enum'
import { NodeGraphQLInterface } from '@interface/graphql/interfaces/node.interface'
import { PolicyGraphQLObject } from '@interface/graphql/objects/authorization/policy.object'
import { TeamNodeGraphQLObject } from '@interface/graphql/objects/team/team-node.object'

@ObjectType('Cycle', {
  implements: () => NodeGraphQLInterface,
  description:
    'A collection of users. It can be either inside another team, or a root team (a.k.a. company)',
})
export class CycleNodeGraphQLObject implements NodeGraphQLInterface {
  @Field({ description: 'The period of the cycle' })
  public period: string

  @Field(() => CadenceGraphQLEnum, {
    description:
      'The candence of this cycle. Cadence is the frequency at which previous objectives have to be grade and new ones created.',
  })
  public cadence: Cadence

  @Field({
    description: 'This flag defines if objectives related to this cycle can be updated',
  })
  public active: boolean

  @Field({ description: 'The date that this cycle starts' })
  public dateStart: Date

  @Field({ description: 'The date that this cycle ends' })
  public dateEnd: Date

  @Field({ description: 'The last update date of this cycle' })
  public updatedAt: Date

  @Field(() => ID, { description: 'The team ID that this cycle belongs to' })
  public teamId: TeamNodeGraphQLObject['id']

  @Field(() => TeamNodeGraphQLObject, { description: 'The team that this cycle belongs to' })
  public team: TeamNodeGraphQLObject

  @Field(() => ID, {
    nullable: true,
    description:
      'Each cycle can relates with a given higher cycle, creating a for of tree-like architecture. If this cycle has any cycle above it, the ID of that will be recorded here',
  })
  public parentId?: CycleNodeGraphQLObject['id']

  @Field(() => CycleNodeGraphQLObject, {
    nullable: true,
    description:
      'Each cycle can relates with a given higher cycle, creating a for of tree-like architecture. If this cycle has any cycle above it, that one will be recorded here',
  })
  public parent?: CycleNodeGraphQLObject

  @Field(() => [CycleNodeGraphQLObject], {
    nullable: true,
    description:
      'Each cycle can have multiple cycles below it. If this cycle has any cycle inside of it, those will be listed here',
  })
  public cycles?: CycleNodeGraphQLObject[]

  public id: string
  public createdAt: Date
  public policies?: PolicyGraphQLObject
}
