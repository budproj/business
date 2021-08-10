import { Field, ID, ObjectType } from '@nestjs/graphql'

import { GuardedNodeGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-node.interface'
import { NodePolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/node-policy.object'
import { NodeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/node.interface'

import { UserGraphQLNode } from '../../user/user.node'
import { KeyResultGraphQLNode } from '../key-result.node'

@ObjectType('KeyResultCheckMark', {
  implements: () => [NodeRelayGraphQLInterface, GuardedNodeGraphQLInterface],
  description: 'A check mark in a given key result',
})
export class KeyResultCheckMarkGraphQLNode implements GuardedNodeGraphQLInterface {
  // TODO: change to enum
  // /home/perin/dev/bud/business/src/interface/graphql/modules/key-result/key-result.node.ts:34
  @Field(() => String, { complexity: 0, description: 'The state of check mark' })
  public readonly state!: string

  @Field(() => String, { complexity: 0, description: 'The text description of a check mark' })
  public readonly description!: string

  @Field(() => Date, { complexity: 0, description: 'last time the check mark was updated' })
  public readonly updatedAt!: Date

  @Field(() => ID, {
    complexity: 0,
    description: 'The ID of the key result this check mark belongs to',
  })
  public readonly keyResultId!: string

  @Field(() => ID, { complexity: 0, description: 'The ID of the user this check mark belongs to' })
  public readonly userId!: string

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => KeyResultGraphQLNode, {
    complexity: 1,
    description: 'The key result that this check mark relates to',
  })
  public readonly keyResult!: KeyResultGraphQLNode

  @Field(() => UserGraphQLNode, {
    complexity: 1,
    description: 'The user that owns this check mark',
  })
  public readonly user!: UserGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
  public readonly policy?: NodePolicyGraphQLObject
}
