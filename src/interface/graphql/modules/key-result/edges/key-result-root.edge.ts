import { Field, ObjectType } from '@nestjs/graphql'

import { EdgeGraphQLInterface } from '@interface/graphql/interfaces/edge.interface'
import { KeyResultGraphQLNode } from '@interface/graphql/nodes/key-result.node'

@ObjectType('KeyResultRootEdge', {
  implements: () => EdgeGraphQLInterface,
  description: 'The edge for our key-result query interface',
})
export class KeyResultRootEdgeGraphQLObject implements EdgeGraphQLInterface<KeyResultGraphQLNode> {
  @Field(() => KeyResultGraphQLNode, { complexity: 1 })
  public node: KeyResultGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor: string
}
