import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'

import { KeyResultCommentGraphQLNode } from '../../key-result-comment.node'

@ObjectType('KeyResultCommentRootEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'The edge for our key-result comment query interface',
})
export class KeyResultCommentRootEdgeGraphQLObject implements EdgeRelayGraphQLInterface<KeyResultCommentGraphQLNode> {
  @Field(() => KeyResultCommentGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultCommentGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
