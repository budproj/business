import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'
import { UserSettingGraphQLNode } from '@interface/graphql/modules/user/setting/user-setting.node'

import { UserSettingEdgeGraphQLObject } from './user-user-setting.edge'

@ObjectType('UserSettings', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing a given user settings based on the provided filters and arguments',
})
export class UserSettingsGraphQLConnection implements GuardedConnectionGraphQLInterface<UserSettingGraphQLNode> {
  @Field(() => [UserSettingEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: UserSettingEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
