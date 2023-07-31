import { Field, ID, ObjectType } from '@nestjs/graphql'

import { GuardedNodeGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-node.interface'
import { NodePolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/node-policy.object'
import { NodeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/node.interface'

import { UserGraphQLNode } from '../user.node'

@ObjectType('Task', {
  implements: () => [NodeRelayGraphQLInterface, GuardedNodeGraphQLInterface],
  description: 'Task is an entity inside a given user. It is used by the user to organize his/her day.',
})
export class TaskGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field({ complexity: 0, description: 'The state of the task' })
  public readonly state!: string

  @Field({ complexity: 0, description: 'The text description of the task' })
  description: string

  @Field(() => ID, { complexity: 0, description: 'The ID of the user who the task is assigned to' })
  assignedUserId: string

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => UserGraphQLNode, {
    complexity: 1,
    description: 'The user this task is assigned to',
  })
  public readonly assignedUser!: UserGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public id: string
  public createdAt: Date
  public policy?: NodePolicyGraphQLObject
}
