import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'
import { TaskGraphQLNode } from '@interface/graphql/modules/user/task/task.node'

@ObjectType('UserTasksEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'This edge represents the relation between users and their key-results',
})
export class UserTasksEdgeGraphQLObject implements EdgeRelayGraphQLInterface<TaskGraphQLNode> {
  @Field(() => TaskGraphQLNode, { complexity: 1 })
  public readonly node!: TaskGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
