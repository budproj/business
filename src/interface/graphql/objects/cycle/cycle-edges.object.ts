import { Field, ObjectType } from '@nestjs/graphql'

import { EdgesGraphQLInterface } from '@interface/graphql/interfaces/edges.interface'

import { CycleNodeGraphQLObject } from './cycle-node.object'

@ObjectType('CycleEdges', {
  implements: () => EdgesGraphQLInterface,
  description: 'The edges for our cycle query interface',
})
export class CycleEdgesGraphQLObject implements EdgesGraphQLInterface<CycleNodeGraphQLObject> {
  @Field(() => [CycleNodeGraphQLObject])
  public nodes: CycleNodeGraphQLObject[]

  public cursor: string
}
