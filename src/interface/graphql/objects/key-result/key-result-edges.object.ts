import { Field, ObjectType } from '@nestjs/graphql'

import { EdgesGraphQLInterface } from '../../interfaces/edges.interface'

import { KeyResultNodeGraphQLObject } from './key-result-node.object'

@ObjectType('KeyResultEdges', {
  implements: () => EdgesGraphQLInterface,
  description: 'The edges for our key-result query interface',
})
export class KeyResultEdgesGraphQLObject
  implements EdgesGraphQLInterface<KeyResultNodeGraphQLObject> {
  @Field(() => [KeyResultNodeGraphQLObject], { complexity: 1 })
  public nodes: KeyResultNodeGraphQLObject[]

  public cursor: string
}
