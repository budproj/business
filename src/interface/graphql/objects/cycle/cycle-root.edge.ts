import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { GuardedEdgeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-edge.interface'

import { CycleGraphQLNode } from './cycle.node'

@ObjectType('CycleRootEdge', {
  implements: () => GuardedEdgeGraphQLInterface,
  description: 'The edge for our cycle query interface',
})
export class CycleRootEdgeGraphQLObject implements GuardedEdgeGraphQLInterface<CycleGraphQLNode> {
  @Field(() => CycleGraphQLNode, { complexity: 1 })
  public node!: CycleGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor!: ConnectionCursor
}
