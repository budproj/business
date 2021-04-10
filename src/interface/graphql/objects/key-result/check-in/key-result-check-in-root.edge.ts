import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { GuardedEdgeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-edge.interface'

import { KeyResultCheckInGraphQLNode } from './key-result-check-in.node'

@ObjectType('KeyResultCheckInRootEdge', {
  implements: () => GuardedEdgeGraphQLInterface,
  description: 'The edge for our key-result comment query interface',
})
export class KeyResultCheckInRootEdgeGraphQLObject
  implements GuardedEdgeGraphQLInterface<KeyResultCheckInGraphQLNode> {
  @Field(() => KeyResultCheckInGraphQLNode, { complexity: 1 })
  public node!: KeyResultCheckInGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor!: ConnectionCursor
}
