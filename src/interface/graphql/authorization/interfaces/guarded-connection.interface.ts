import { Field, InterfaceType } from '@nestjs/graphql'
import { Edge } from 'graphql-relay'

import { ConnectionRelayInterface } from '../../relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '../../relay/objects/page-info.object'
import { PolicyGraphQLObject } from '../objects/policy.object'

import { GuardedNodeGraphQLInterface } from './guarded-node.interface'

@InterfaceType('GuardedConnectionInterface', {
  implements: () => ConnectionRelayInterface,
  description: 'A guarded connection is like a common connection, but with an extra policy field',
})
export abstract class GuardedConnectionGraphQLInterface<
  N extends GuardedNodeGraphQLInterface
> extends ConnectionRelayInterface<N> {
  @Field(() => PolicyGraphQLObject, {
    complexity: 1,
    description:
      'The policy regarding the current connection. Those policies decribe actions that your user can perform for this connection',
  })
  public readonly policy?: PolicyGraphQLObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly edges!: Array<Edge<N>>
  public readonly pageInfo!: PageInfoRelayObject
}
