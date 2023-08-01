import { Field, ObjectType } from '@nestjs/graphql'

import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-node.interface'
import { NodePolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/node-policy.object'
import { NodeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/node.interface'

import { KeyResultsGraphQLConnection } from '../../key-result/connections/key-results/key-results.connection'
import { UsersGraphQLConnection } from '../../user/connections/users/users.connection'

@ObjectType('Flags', {
  implements: () => [NodeRelayGraphQLInterface, GuardedNodeGraphQLInterface],
  description:
    'Task is an entity inside a given user. It is used by the user to organize his/her day.',
})
export class FlagsGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field(() => KeyResultsGraphQLConnection, {
    complexity: 0,
    description: 'The latest check-in date in this status',
    nullable: true,
  })
  public readonly outdated?: KeyResult

  @Field(() => KeyResultsGraphQLConnection, {
    complexity: 0,
    description: 'The latest check-in date in this status',
    nullable: true,
  })
  public readonly barrier?: KeyResult

  @Field(() => KeyResultsGraphQLConnection, {
    complexity: 0,
    description: 'The latest check-in date in this status',
    nullable: true,
  })
  public readonly low?: KeyResult

  @Field(() => UsersGraphQLConnection, {
    complexity: 0,
    description: 'The latest check-in date in this status',
    nullable: true,
  })
  public readonly noRelated?: User

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
  public readonly policy?: NodePolicyGraphQLObject
}
