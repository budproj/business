import { Field, ObjectType } from '@nestjs/graphql'

import { EdgeGraphQLInterface } from '@interface/graphql/interfaces/edge.interface'
import { CycleGraphQLNode } from '@interface/graphql/nodes/cycle.node'

@ObjectType('CycleRootEdge', {
  implements: () => EdgeGraphQLInterface,
  description: 'The edge for our cycle query interface',
})
export class CycleRootEdgeGraphQLObject implements EdgeGraphQLInterface<CycleGraphQLNode> {
  @Field(() => CycleGraphQLNode, { complexity: 1 })
  public node: CycleGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor: string
}
