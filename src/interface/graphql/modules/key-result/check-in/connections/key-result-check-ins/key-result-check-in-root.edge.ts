import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'

import { KeyResultCheckInGraphQLNode } from '../../key-result-check-in.node'

@ObjectType('KeyResultCheckInRootEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'The edge for our key-result comment query interface',
})
export class KeyResultCheckInRootEdgeGraphQLObject
  implements EdgeRelayGraphQLInterface<KeyResultCheckInGraphQLNode>
{
  @Field(() => KeyResultCheckInGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultCheckInGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
