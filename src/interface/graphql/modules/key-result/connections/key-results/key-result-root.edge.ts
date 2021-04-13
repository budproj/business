import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '@interface/graphql/relay/interfaces/edge.interface'

import { KeyResultGraphQLNode } from '../../key-result.node'

@ObjectType('KeyResultRootEdge', {
  implements: () => EdgeRelayInterface,
  description: 'The edge for our key-result query interface',
})
export class KeyResultRootEdgeGraphQLObject implements EdgeRelayInterface<KeyResultGraphQLNode> {
  @Field(() => KeyResultGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
