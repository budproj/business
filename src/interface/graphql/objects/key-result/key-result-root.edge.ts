import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '@infrastructure/relay/interfaces/edge.interface'
import { GuardedEdgeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-edge.interface'

import { KeyResultGraphQLNode } from './key-result.node'

@ObjectType('KeyResultRootEdge', {
  implements: () => [EdgeRelayInterface, GuardedEdgeGraphQLInterface],
  description: 'The edge for our key-result query interface',
})
export class KeyResultRootEdgeGraphQLObject
  implements GuardedEdgeGraphQLInterface<KeyResultGraphQLNode> {
  @Field(() => KeyResultGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
