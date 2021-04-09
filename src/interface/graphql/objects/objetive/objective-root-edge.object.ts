import { Field, ObjectType } from '@nestjs/graphql'

import { EdgeGraphQLInterface } from '../../interfaces/edge.interface'

import { ObjectiveNodeGraphQLObject } from './objective-node.object'

@ObjectType('ObjectiveRootEdge', {
  implements: () => EdgeGraphQLInterface,
  description: 'The edge for our objective query interface',
})
export class ObjectiveRootEdgeGraphQLObject
  implements EdgeGraphQLInterface<ObjectiveNodeGraphQLObject> {
  @Field(() => ObjectiveNodeGraphQLObject, { complexity: 1 })
  public node: ObjectiveNodeGraphQLObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor: string
}
