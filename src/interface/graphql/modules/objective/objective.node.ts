import { Field, Float, ID, ObjectType } from '@nestjs/graphql'

import { GuardedNodeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-node.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { CycleGraphQLNode } from '@interface/graphql/modules/cycle/cycle.node'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { NodeRelayInterface } from '@interface/graphql/relay/interfaces/node.interface'

import { ObjectiveKeyResultsGraphQLConnection } from './connections/objective-key-results/objective-key-results.connection'
import { ObjectiveStatusObject } from './objects/objective-status.object'

@ObjectType('Objective', {
  implements: () => [NodeRelayInterface, GuardedNodeGraphQLInterface],
  description:
    'The current status of this objective. By status we mean progress, confidence, and other reported values from it',
})
export class ObjectiveGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field({ complexity: 0, description: 'The title of the objective' })
  public readonly title!: string

  @Field({ complexity: 0, description: 'The last update date of the objective' })
  public readonly updatedAt!: Date

  @Field(() => ID, { complexity: 0, description: 'The cycle ID that owns this objective' })
  public readonly cycleId!: string

  @Field(() => ID, { complexity: 0, description: 'The user ID that owns this objective' })
  public readonly ownerId!: string

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => ObjectiveStatusObject, {
    description:
      'The status of the given objective. Here you can fetch the current progress, confidence, and other for that objective',
  })
  public status!: ObjectiveStatusObject

  @Field(() => Float, {
    description:
      'The percentage progress increase of the objective since the last week. We consider a week as a "business" week, considering it starting on saturday and ending on friday',
  })
  public progressIncreaseSinceLastWeek!: number

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

  // **********************************************************************************************
  // CONNECTION FIELDS
  // **********************************************************************************************

  @Field(() => ObjectiveKeyResultsGraphQLConnection, {
    complexity: 0,
    nullable: true,
    description: 'A creation date ordered list of key results that belongs to this objective',
  })
  public readonly keyResults?: ObjectiveKeyResultsGraphQLConnection

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
  public readonly policy?: PolicyGraphQLObject
}
