import { Field, ObjectType } from '@nestjs/graphql'

import { EdgesGraphQLInterface } from '../../../interfaces/edges.interface'

import { KeyResultCheckInNodeGraphQLObject } from './key-result-check-in-node.object'

@ObjectType('KeyResultCheckInEdges', {
  implements: () => EdgesGraphQLInterface,
  description: 'The edges for our key-result comment query interface',
})
export class KeyResultCheckInEdgesGraphQLObject
  implements EdgesGraphQLInterface<KeyResultCheckInNodeGraphQLObject> {
  @Field(() => [KeyResultCheckInNodeGraphQLObject], { complexity: 1 })
  public nodes: KeyResultCheckInNodeGraphQLObject[]

  public cursor: string
}
