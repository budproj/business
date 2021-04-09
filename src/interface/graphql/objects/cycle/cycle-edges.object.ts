import { Field, ObjectType } from '@nestjs/graphql'

import { EdgesGraphQLInterface } from '../../interfaces/edges.interface'

import { CycleNodeGraphQLObject } from './cycle-node.object'

@ObjectType('CycleEdges', {
  implements: () => EdgesGraphQLInterface,
  description: 'The edges for our cycle query interface',
})
export class CycleEdgesGraphQLObject implements EdgesGraphQLInterface<CycleNodeGraphQLObject> {
  @Field(() => [CycleNodeGraphQLObject], { complexity: 1 })
  public nodes: CycleNodeGraphQLObject[]

  public cursor: string
}
