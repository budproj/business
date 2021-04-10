import { Field, InterfaceType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '@infrastructure/relay/interfaces/edge.interface'

import { PolicyGraphQLObject } from '../objects/policy.object'

import { GuardedNodeGraphQLInterface } from './guarded-node.interface'

@InterfaceType('GuardedEdge', {
  description: 'A guarded edge is like a common edge, but with an extra policy field',
})
export abstract class GuardedEdgeGraphQLInterface<N extends GuardedNodeGraphQLInterface>
  implements EdgeRelayInterface<N> {
  @Field(() => PolicyGraphQLObject, {
    complexity: 1,
    description:
      'The policy regarding the current edge. Those policies decribe actions that your user can perform for this edge',
  })
  public policy?: PolicyGraphQLObject

  @Field(() => String, {
    complexity: 0,
    nullable: true,
    description: 'The cursor value of this node',
  })
  public cursor!: ConnectionCursor

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public node: N
}
