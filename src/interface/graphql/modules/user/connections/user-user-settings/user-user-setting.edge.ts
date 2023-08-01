import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'
import { UserSettingGraphQLNode } from '@interface/graphql/modules/user/setting/user-setting.node'

@ObjectType('UserSettingEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'This edge represents the relation between users and their settings',
})
export class UserSettingEdgeGraphQLObject implements EdgeRelayGraphQLInterface<UserSettingGraphQLNode> {
  @Field(() => UserSettingGraphQLNode, { complexity: 1 })
  public readonly node!: UserSettingGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
