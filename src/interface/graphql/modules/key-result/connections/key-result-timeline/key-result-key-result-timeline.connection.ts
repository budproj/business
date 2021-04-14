import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { ConnectionRelayInterface } from '@interface/graphql/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/relay/objects/page-info.object'

import { KeyResultTimelineEntry } from './key-result-timeline-entry.type'
import { KeyResultTimelineEdgeGraphQLObject } from './key-result-timeline.edge'

@ObjectType('KeyResultTimeline', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description:
    'A list with a given key-result timeline based on the provided filters and arguments',
})
export class KeyResultTimelineGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultTimelineEntry> {
  @Field(() => [KeyResultTimelineEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultTimelineEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
