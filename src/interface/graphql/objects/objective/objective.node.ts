import { Field, ID, ObjectType } from '@nestjs/graphql'

import { GuardedNodeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-node.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'

import { NodeRelayInterface } from '../../relay/interfaces/node.interface'
import { CycleGraphQLNode } from '../cycle/cycle.node'
import { KeyResultGraphQLNode } from '../key-result/key-result.node'
import { UserGraphQLNode } from '../user/user.node'

import { ObjectiveStatusObject } from './objective-status.object'

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
  public status: ObjectiveStatusObject

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

  @Field(() => [KeyResultGraphQLNode], {
    complexity: 0,
    nullable: true,
    description: 'A creation date ordered list of key results that belongs to this objective',
  })
  public readonly keyResults?: KeyResultGraphQLNode[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
  public readonly policy?: PolicyGraphQLObject
}
