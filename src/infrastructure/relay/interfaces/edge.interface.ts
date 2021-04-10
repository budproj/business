import { Field, InterfaceType } from '@nestjs/graphql'
import { ConnectionCursor, Edge } from 'graphql-relay'

import { NodeRelayInterface } from './node.interface'

@InterfaceType('Edge', {
  description: 'An edge is used for proper pagination in nodes',
})
export abstract class EdgeRelayInterface<N extends NodeRelayInterface> implements Edge<N> {
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
