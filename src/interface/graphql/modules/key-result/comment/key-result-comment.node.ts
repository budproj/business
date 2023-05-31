import { Field, ID, ObjectType } from '@nestjs/graphql'

import { KeyResultCommentType } from '@core/modules/key-result/enums/key-result-comment-type.enum'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-node.interface'
import { NodePolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/node-policy.object'
import { NodeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/node.interface'
import { KeyResultGraphQLNode } from '@interface/graphql/modules/key-result/key-result.node'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'

@ObjectType('KeyResultComment', {
  implements: () => [NodeRelayGraphQLInterface, GuardedNodeGraphQLInterface],
  description: 'A comment in a given key result',
})
export class KeyResultCommentGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field(() => String, { complexity: 0, description: 'The text of the comment' })
  public readonly text!: string

  @Field({ complexity: 0, description: 'The last update date of the comment' })
  public readonly updatedAt!: Date

  @Field(() => String, {
    complexity: 0,
    description: 'The type of the key-result commment',
    defaultValue: KeyResultCommentType.comment,
  })
  public readonly type!: KeyResultCommentType

  @Field(() => String, {
    description: 'The extra values that returns dependant on the key-result type',
    nullable: true,
  })
  public readonly extra?: any

  @Field(() => ID, {
    complexity: 0,
    description: 'The key result ID that this comment is related to',
  })
  public readonly keyResultId!: string

  @Field(() => ID, { complexity: 0, description: 'The user ID that owns this comment' })
  public readonly userId!: string

  @Field(() => ID, { complexity: 0, description: 'The ID of the parent comment', nullable: true })
  public readonly parentId!: string | null

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
