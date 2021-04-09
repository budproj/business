import { Field, ObjectType } from '@nestjs/graphql'

import { EdgeGraphQLInterface } from '../../../interfaces/edge.interface'

import { KeyResultCheckInNodeGraphQLObject } from './key-result-check-in-node.object'

@ObjectType('KeyResultCheckInRootEdge', {
  implements: () => EdgeGraphQLInterface,
  description: 'The edge for our key-result comment query interface',
})
export class KeyResultCheckInRootEdgeGraphQLObject
  implements EdgeGraphQLInterface<KeyResultCheckInNodeGraphQLObject> {
  @Field(() => KeyResultCheckInNodeGraphQLObject, { complexity: 1 })
  public node: KeyResultCheckInNodeGraphQLObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor: string
}
