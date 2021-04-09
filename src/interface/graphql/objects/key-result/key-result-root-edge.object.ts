import { Field, ObjectType } from '@nestjs/graphql'

import { EdgeGraphQLInterface } from '../../interfaces/edge.interface'

import { KeyResultNodeGraphQLObject } from './key-result-node.object'

@ObjectType('KeyResultRootEdge', {
  implements: () => EdgeGraphQLInterface,
  description: 'The edge for our key-result query interface',
})
export class KeyResultRootEdgeGraphQLObject
  implements EdgeGraphQLInterface<KeyResultNodeGraphQLObject> {
  @Field(() => KeyResultNodeGraphQLObject, { complexity: 1 })
  public node: KeyResultNodeGraphQLObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor: string
}
