import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { KeyResultGraphQLNode } from '@interface/graphql/modules/key-result/key-result.node'
import { EdgeRelayInterface } from '@interface/graphql/relay/interfaces/edge.interface'

@ObjectType('ObjectiveKeyResultEdge', {
  implements: () => EdgeRelayInterface,
  description: 'This edge represents the relation between objectives and their key-results',
})
export class ObjectiveKeyResultEdgeGraphQLObject
  implements EdgeRelayInterface<KeyResultGraphQLNode> {
  @Field(() => KeyResultGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}