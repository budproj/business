import { Field, ID, ObjectType } from '@nestjs/graphql'

import { GuardedNodeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-node.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'

import { UserGraphQLNode } from '../../user/user.node'
import { KeyResultGraphQLNode } from '../key-result.node'

@ObjectType('KeyResultComment', {
  implements: () => GuardedNodeGraphQLInterface,
  description: 'A comment in a given key result',
})
export class KeyResultCommentGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field(() => String, { complexity: 0, description: 'The text of the comment' })
  public text!: string

  @Field({ complexity: 0, description: 'The last update date of the comment' })
  public updatedAt!: Date

  @Field(() => ID, {
    complexity: 0,
    description: 'The key result ID that this comment is related to',
  })
  public keyResultId!: KeyResultGraphQLNode['id']

  @Field(() => ID, { complexity: 0, description: 'The user ID that owns this comment' })
  public userId!: UserGraphQLNode['id']

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => KeyResultGraphQLNode, {
    complexity: 1,
    description: 'The key result that this comment relates to',
  })
  public keyResult!: KeyResultGraphQLNode

  @Field(() => UserGraphQLNode, {
    complexity: 1,
    description: 'The user that owns this comment',
  })
  public user!: UserGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public id!: string
  public createdAt!: Date
  public policies?: PolicyGraphQLObject
}
