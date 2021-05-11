import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'

import { CycleGraphQLNode } from '../../cycle.node'

@ObjectType('CycleCycleEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'This edge represents the relation between cycles and their users',
})
export class CycleCycleEdgeGraphQLObject implements EdgeRelayGraphQLInterface<CycleGraphQLNode> {
  @Field(() => CycleGraphQLNode, { complexity: 1 })
  public readonly node!: CycleGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
