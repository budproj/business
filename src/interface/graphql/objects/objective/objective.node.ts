import { Field, ID, ObjectType } from '@nestjs/graphql'

import { NodeRelayInterface } from '@infrastructure/relay/interfaces/node.interface'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-node.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'

import { CycleGraphQLNode } from '../cycle/cycle.node'
import { KeyResultGraphQLNode } from '../key-result/key-result.node'
import { UserGraphQLNode } from '../user/user.node'

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
  public readonly cycleId!: CycleGraphQLNode['id']

  @Field(() => ID, { complexity: 0, description: 'The user ID that owns this objective' })
  public readonly ownerId!: UserGraphQLNode['id']

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

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
