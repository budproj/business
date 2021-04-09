import { Field, ObjectType } from '@nestjs/graphql'

import { EdgeGraphQLInterface } from '@interface/graphql/interfaces/edge.interface'

import { CycleNodeGraphQLObject } from './cycle-node.object'

@ObjectType('CycleRootEdge', {
  implements: () => EdgeGraphQLInterface,
  description: 'The edge for our cycle query interface',
})
export class CycleRootEdgeGraphQLObject implements EdgeGraphQLInterface<CycleNodeGraphQLObject> {
  @Field(() => CycleNodeGraphQLObject, { complexity: 1 })
  public node: CycleNodeGraphQLObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor: string
}
