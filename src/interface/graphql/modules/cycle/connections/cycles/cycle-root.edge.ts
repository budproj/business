import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'

import { CycleGraphQLNode } from '../../cycle.node'

@ObjectType('CycleRootEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'The edge for our cycle query interface',
})
export class CycleRootEdgeGraphQLObject implements EdgeRelayGraphQLInterface<CycleGraphQLNode> {
  @Field(() => CycleGraphQLNode, { complexity: 1 })
  public readonly node!: CycleGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
