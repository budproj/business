import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionRelayInterface } from '@infrastructure/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@infrastructure/relay/objects/page-info.object'

import { GuardedConnectionGraphQLInterface } from '../../authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '../../authorization/objects/policy.object'

import { UserRootEdgeGraphQLObject } from './user-root.edge'
import { UserGraphQLNode } from './user.node'

@ObjectType('Users', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing users based on the provided filters and arguments',
})
export class UsersGraphQLConnection implements GuardedConnectionGraphQLInterface<UserGraphQLNode> {
  @Field(() => [UserRootEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: UserRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}