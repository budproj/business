import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'
import { TaskGraphQLNode } from '@interface/graphql/modules/user/task/task.node'

import { UserTasksEdgeGraphQLObject } from './user-tasks.edge'

@ObjectType('UserTasks', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing a given user tasks based on the provided filters and arguments',
})
export class UserTasksGraphQLConnection
  implements GuardedConnectionGraphQLInterface<TaskGraphQLNode>
{
  @Field(() => [UserTasksEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: UserTasksEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
