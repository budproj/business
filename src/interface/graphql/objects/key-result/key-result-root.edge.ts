import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { GuardedEdgeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-edge.interface'

import { KeyResultGraphQLNode } from './key-result.node'

@ObjectType('KeyResultRootEdge', {
  implements: () => GuardedEdgeGraphQLInterface,
  description: 'The edge for our key-result query interface',
})
export class KeyResultRootEdgeGraphQLObject
  implements GuardedEdgeGraphQLInterface<KeyResultGraphQLNode> {
  @Field(() => KeyResultGraphQLNode, { complexity: 1 })
  public node!: KeyResultGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor!: ConnectionCursor
}
