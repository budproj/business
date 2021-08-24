import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'

import { KeyResultProgressRecordGraphQLNode } from '../../progress-record/key-result-progress-record.node'

@ObjectType('KeyResultProgressHistoryEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'The edge for our key-result progress history query interface',
})
export class KeyResultProgressHistoryEdgeGraphQLObject
  implements EdgeRelayGraphQLInterface<KeyResultProgressRecordGraphQLNode>
{
  @Field(() => KeyResultProgressRecordGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultProgressRecordGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
