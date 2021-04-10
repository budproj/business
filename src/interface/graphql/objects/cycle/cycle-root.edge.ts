import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '@infrastructure/relay/interfaces/edge.interface'
import { GuardedEdgeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-edge.interface'

import { CycleGraphQLNode } from './cycle.node'

@ObjectType('CycleRootEdge', {
  implements: () => [EdgeRelayInterface, GuardedEdgeGraphQLInterface],
  description: 'The edge for our cycle query interface',
})
export class CycleRootEdgeGraphQLObject implements GuardedEdgeGraphQLInterface<CycleGraphQLNode> {
  @Field(() => CycleGraphQLNode, { complexity: 1 })
  public readonly node!: CycleGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
