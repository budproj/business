import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { KeyResultTimelineEntry } from './key-result-timeline-entry.type'
import { KeyResultTimelineEdgeGraphQLObject } from './key-result-timeline.edge'

@ObjectType('KeyResultTimeline', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description:
    'A list with a given key-result timeline based on the provided filters and arguments',
})
export class KeyResultTimelineGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultTimelineEntry>
{
  @Field(() => [KeyResultTimelineEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultTimelineEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
