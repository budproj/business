import { Field, ObjectType } from '@nestjs/graphql'

import { EdgeGraphQLInterface } from '@interface/graphql/interfaces/edge.interface'
import { ObjectiveGraphQLNode } from '@interface/graphql/nodes/objective.node'

@ObjectType('ObjectiveRootEdge', {
  implements: () => EdgeGraphQLInterface,
  description: 'The edge for our objective query interface',
})
export class ObjectiveRootEdgeGraphQLObject
  implements EdgeGraphQLInterface<ObjectiveGraphQLNode> {
  @Field(() => ObjectiveGraphQLNode, { complexity: 1 })
  public node: ObjectiveGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor: string
}
