import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'
import { KeyResultGraphQLNode } from '@interface/graphql/modules/key-result/key-result.node'

@ObjectType('ObjectiveKeyResultEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'This edge represents the relation between objectives and their key-results',
})
export class ObjectiveKeyResultEdgeGraphQLObject implements EdgeRelayGraphQLInterface<KeyResultGraphQLNode> {
  @Field(() => KeyResultGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
