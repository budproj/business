import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'

import { KeyResultTimelineEntry } from './key-result-timeline-entry.type'
import { KeyResultTimelineEntryGraphQLUnion } from './key-result-timeline-entry.union'

@ObjectType('KeyResultTimelineEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'The edge for our key-result timeline query interface',
})
export class KeyResultTimelineEdgeGraphQLObject
  implements EdgeRelayGraphQLInterface<KeyResultTimelineEntry> {
  @Field(() => KeyResultTimelineEntryGraphQLUnion, { complexity: 1 })
  public readonly node!: KeyResultTimelineEntry

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
