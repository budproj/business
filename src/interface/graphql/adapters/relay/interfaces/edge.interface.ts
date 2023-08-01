import { Field, InterfaceType } from '@nestjs/graphql'
import { ConnectionCursor, Edge } from 'graphql-relay'

import { NodeRelayGraphQLInterface } from './node.interface'

@InterfaceType('EdgeInterface', {
  description: 'An edge is used for proper pagination in nodes',
})
export abstract class EdgeRelayGraphQLInterface<N extends NodeRelayGraphQLInterface> implements Edge<N> {
  @Field(() => String, {
    complexity: 0,
    nullable: true,
    description: 'The cursor value of this node',
  })
  public readonly cursor!: ConnectionCursor

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly node: N
}
