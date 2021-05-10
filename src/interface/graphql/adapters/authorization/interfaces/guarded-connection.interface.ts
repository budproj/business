import { Field, InterfaceType } from '@nestjs/graphql'
import { Edge } from 'graphql-relay'

import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'

import { ConnectionRelayInterface } from '../../relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '../../relay/objects/page-info.object'

import { GuardedNodeGraphQLInterface } from './guarded-node.interface'

@InterfaceType('GuardedConnectionInterface', {
  implements: () => ConnectionRelayInterface,
  description: 'A guarded connection is like a common connection, but with an extra policy field',
})
export abstract class GuardedConnectionGraphQLInterface<
  N extends GuardedNodeGraphQLInterface
> extends ConnectionRelayInterface<N> {
  @Field(() => ConnectionPolicyGraphQLObject, {
    complexity: 1,
    description:
      'The policy regarding the current connection. Those policies describe actions that your user can perform for this connection',
  })
  public readonly policy?: ConnectionPolicyGraphQLObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly edges!: Array<Edge<N>>
  public readonly pageInfo!: PageInfoRelayObject
}
