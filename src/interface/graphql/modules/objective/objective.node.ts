import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ObjectiveMode } from '@core/modules/objective/enums/objective-mode.enum'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-node.interface'
import { NodePolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/node-policy.object'
import { NodeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/node.interface'
import { CycleGraphQLNode } from '@interface/graphql/modules/cycle/cycle.node'
import { ObjectiveTeamsGraphQLConnection } from '@interface/graphql/modules/objective/connections/objective-teams/objective-teams.connection'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { DeltaGraphQLObject } from '@interface/graphql/objects/delta.object'
import { StatusGraphQLObject } from '@interface/graphql/objects/status.object'

import { ObjectiveKeyResultsGraphQLConnection } from './connections/objective-key-results/objective-key-results.connection'

@ObjectType('Objective', {
  implements: () => [NodeRelayGraphQLInterface, GuardedNodeGraphQLInterface],
  description:
    'The current status of this objective. By status we mean progress, confidence, and other reported values from it',
})
export class ObjectiveGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field({ complexity: 0, description: 'The title of the objective' })
  public readonly title!: string

  @Field({ complexity: 0, description: 'The description of the objective', nullable: true })
  public readonly description!: string

  @Field({ complexity: 0, description: 'The mode of the objective' })
  public readonly mode?: ObjectiveMode

  @Field({ complexity: 0, description: 'The last update date of the objective' })
  public readonly updatedAt!: Date

  @Field(() => ID, { complexity: 0, description: 'The cycle ID that owns this objective' })
  public readonly cycleId!: string

  @Field(() => ID, {
    complexity: 0,
    nullable: true,
    description: 'The team ID that owns this objective',
  })
  public readonly teamId!: string

  @Field(() => ID, { complexity: 0, description: 'The user ID that owns this objective' })
  public readonly ownerId!: string

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => StatusGraphQLObject, {
    complexity: 1,
    description:
      'The status of the given objective. Here you can fetch the current progress, confidence, and other for that objective',
  })
  public status!: StatusGraphQLObject

  @Field(() => DeltaGraphQLObject, {
    complexity: 1,
    description: 'The delta of this objective comparing with last week',
  })
  public delta!: DeltaGraphQLObject

  @Field(() => CycleGraphQLNode, {
    complexity: 1,
    description: 'The cycle that owns this objective',
  })
  public readonly cycle!: CycleGraphQLNode

  @Field(() => UserGraphQLNode, {
    complexity: 1,
    description: 'The user that owns this objective',
  })
  public readonly owner!: UserGraphQLNode

  @Field(() => TeamGraphQLNode, {
    complexity: 1,
    description: 'The team that owns this objective',
    nullable: true,
  })
  public readonly team?: TeamGraphQLNode

  // **********************************************************************************************
  // CONNECTION FIELDS
  // **********************************************************************************************

  @Field(() => ObjectiveKeyResultsGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'A creation date ordered list of key results that belongs to this objective',
  })
  public readonly keyResults?: ObjectiveKeyResultsGraphQLConnection

  @Field(() => ObjectiveTeamsGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'A creation date ordered list of support teams of this objective',
  })
  public readonly supportTeams?: ObjectiveTeamsGraphQLConnection

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
  public readonly policy?: NodePolicyGraphQLObject
}
