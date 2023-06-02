import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'

import { KeyResultUpdateGraphQLNode } from '../../key-result-update.node'

@ObjectType('KeyResultUpdateRootEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'The edge for our key-result update query interface',
})
export class KeyResultUpdateRootEdgeGraphQLObject
  implements EdgeRelayGraphQLInterface<KeyResultUpdateGraphQLNode>
{
  @Field(() => KeyResultUpdateGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultUpdateGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
