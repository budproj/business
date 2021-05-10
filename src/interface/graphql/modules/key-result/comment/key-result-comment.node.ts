import { Field, ID, ObjectType } from '@nestjs/graphql'

import { GuardedNodeGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-node.interface'
import { NodePolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/node-policy.object'
import { NodeRelayInterface } from '@interface/graphql/adapters/relay/interfaces/node.interface'
import { KeyResultGraphQLNode } from '@interface/graphql/modules/key-result/key-result.node'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'

@ObjectType('KeyResultComment', {
  implements: () => [NodeRelayInterface, GuardedNodeGraphQLInterface],
  description: 'A comment in a given key result',
})
export class KeyResultCommentGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field(() => String, { complexity: 0, description: 'The text of the comment' })
  public readonly text!: string

  @Field({ complexity: 0, description: 'The last update date of the comment' })
  public readonly updatedAt!: Date

  @Field(() => ID, {
    complexity: 0,
    description: 'The key result ID that this comment is related to',
  })
  public readonly keyResultId!: string

  @Field(() => ID, { complexity: 0, description: 'The user ID that owns this comment' })
  public readonly userId!: string

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => KeyResultGraphQLNode, {
    complexity: 1,
    description: 'The key result that this comment relates to',
  })
  public readonly keyResult!: KeyResultGraphQLNode

  @Field(() => UserGraphQLNode, {
    complexity: 1,
    description: 'The user that owns this comment',
  })
  public readonly user!: UserGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
  public readonly policy?: NodePolicyGraphQLObject
}
