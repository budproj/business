import { Field, ObjectType } from '@nestjs/graphql'

import { EdgeGraphQLInterface } from '@interface/graphql/interfaces/edge.interface'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/nodes/key-result-check-in.node'

@ObjectType('KeyResultCheckInRootEdge', {
  implements: () => EdgeGraphQLInterface,
  description: 'The edge for our key-result comment query interface',
})
export class KeyResultCheckInRootEdgeGraphQLObject
  implements EdgeGraphQLInterface<KeyResultCheckInGraphQLNode> {
  @Field(() => KeyResultCheckInGraphQLNode, { complexity: 1 })
  public node: KeyResultCheckInGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor: string
}
