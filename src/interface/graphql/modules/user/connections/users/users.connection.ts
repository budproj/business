import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { ConnectionRelayInterface } from '@interface/graphql/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/relay/objects/page-info.object'

import { UserGraphQLNode } from '../../user.node'

import { UserRootEdgeGraphQLObject } from './user-root.edge'

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
