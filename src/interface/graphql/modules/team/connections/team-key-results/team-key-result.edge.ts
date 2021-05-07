import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'
import { KeyResultGraphQLNode } from '@interface/graphql/modules/key-result/key-result.node'

@ObjectType('TeamKeyResultEdge', {
  implements: () => EdgeRelayInterface,
  description: 'This edge represents the relation between teams and their key-results',
})
export class TeamKeyResultEdgeGraphQLObject implements EdgeRelayInterface<KeyResultGraphQLNode> {
  @Field(() => KeyResultGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
