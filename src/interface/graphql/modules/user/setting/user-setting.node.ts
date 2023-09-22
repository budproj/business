import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Key } from '@core/modules/user/setting/user-setting.enums'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-node.interface'
import { NodePolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/node-policy.object'
import { NodeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/node.interface'
import { UserSettingKeyGraphQLEnum } from '@interface/graphql/modules/user/setting/user-setting.enums'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'

@ObjectType('UserSetting', {
  implements: () => [NodeRelayGraphQLInterface, GuardedNodeGraphQLInterface],
  description: 'A setting is a record that customizes a given user preferences',
})
export class UserSettingGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field(() => UserSettingKeyGraphQLEnum, {
    complexity: 0,
    description: 'The key of the setting',
  })
  public readonly key!: Key

  @Field({ complexity: 0, description: 'The value of this setting' })
  public readonly value!: string

  @Field(() => ID, { complexity: 0, description: 'The ID of the user attached to this setting' })
  public readonly userId!: string

  @Field(() => String, {
    description: 'The comment count of the key result, with a JSON value',
    nullable: false,
  })
  public readonly preferences?: any

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => UserGraphQLNode, { complexity: 1, description: 'The user attached to this setting' })
  public readonly user!: UserGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
  public readonly policy?: NodePolicyGraphQLObject
}
