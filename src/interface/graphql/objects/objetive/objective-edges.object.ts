import { Field, ObjectType } from '@nestjs/graphql'

import { EdgesGraphQLInterface } from '../../interfaces/edges.interface'

import { ObjectiveNodeGraphQLObject } from './objective-node.object'

@ObjectType('ObjectiveEdges', {
  implements: () => EdgesGraphQLInterface,
  description: 'The edges for our objective query interface',
})
export class ObjectiveEdgesGraphQLObject
  implements EdgesGraphQLInterface<ObjectiveNodeGraphQLObject> {
  @Field(() => [ObjectiveNodeGraphQLObject])
  public nodes: ObjectiveNodeGraphQLObject[]

  public cursor: string
}
