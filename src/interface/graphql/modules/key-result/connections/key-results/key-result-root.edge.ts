import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'

import { KeyResultGraphQLNode } from '../../key-result.node'

@ObjectType('KeyResultRootEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'The edge for our key-result query interface',
})
export class KeyResultRootEdgeGraphQLObject
  implements EdgeRelayGraphQLInterface<KeyResultGraphQLNode> {
  @Field(() => KeyResultGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
