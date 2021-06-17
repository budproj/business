import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-node.interface'
import { NodePolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/node-policy.object'
import { NodeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/node.interface'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'
import { StatusGraphQLObject } from '@interface/graphql/objects/status.object'

import { ObjectivesGraphQLConnection } from '../objective/connections/objectives/objectives.connection'

import { CycleCyclesGraphQLConnection } from './connections/cycle-cycles/cycle-cycles.connection'
import { CycleKeyResultsGraphQLConnection } from './connections/cycle-key-results/cycle-key-results.connection'
import { CadenceGraphQLEnum } from './enums/cadence.enum'

@ObjectType('Cycle', {
  implements: () => [NodeRelayGraphQLInterface, GuardedNodeGraphQLInterface],
  description:
    'A collection of users. It can be either inside another team, or a root team (a.k.a. company)',
})
export class CycleGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field({ complexity: 0, description: 'The period of the cycle' })
  public readonly period!: string

  @Field(() => CadenceGraphQLEnum, {
    complexity: 0,
    description:
      'The candence of this cycle. Cadence is the frequency at which previous objectives have to be grade and new ones created.',
  })
  public readonly cadence!: Cadence

  @Field({
    complexity: 0,
    description: 'This flag defines if objectives related to this cycle can be updated',
  })
  public readonly active!: boolean

  @Field({ complexity: 0, description: 'The date that this cycle starts' })
  public readonly dateStart!: Date

  @Field({ complexity: 0, description: 'The date that this cycle ends' })
  public readonly dateEnd!: Date

  @Field({ complexity: 0, description: 'The last update date of this cycle' })
  public readonly updatedAt!: Date

  @Field(() => ID, { complexity: 0, description: 'The team ID that this cycle belongs to' })
  public readonly teamId!: string

  @Field(() => ID, {
    complexity: 0,
    nullable: true,
    description:
      'Each cycle can relates with a given higher cycle, creating a for of tree-like architecture. If this cycle has any cycle above it, the ID of that will be recorded here',
  })
  public readonly parentId?: string

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => StatusGraphQLObject, {
    description:
      'The status of the given cycle. Here you can fetch the current progress, confidence, and others for that cycle',
  })
  public status!: StatusGraphQLObject

  @Field(() => TeamGraphQLNode, {
    complexity: 1,
    description: 'The team that this cycle belongs to',
  })
  public readonly team!: TeamGraphQLNode

  @Field(() => CycleGraphQLNode, {
    complexity: 1,
    nullable: true,
    description:
      'Each cycle can relates with a given higher cycle, creating a for of tree-like architecture. If this cycle has any cycle above it, that one will be recorded here',
  })
  public readonly parent?: CycleGraphQLNode

  // **********************************************************************************************
  // CONNECTION FIELDS
  // **********************************************************************************************

  @Field(() => CycleCyclesGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description:
      'Each cycle can have multiple cycles below it. If this cycle has any cycle inside of it, those will be listed here',
  })
  public readonly cycles?: CycleCyclesGraphQLConnection

  @Field(() => ObjectivesGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'The objectives inside this cycle',
  })
  public readonly objectives?: ObjectivesGraphQLConnection

  @Field(() => CycleKeyResultsGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'The key-results from this cycle',
  })
  public readonly keyResults?: CycleKeyResultsGraphQLConnection

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
  public readonly policy?: NodePolicyGraphQLObject
}
