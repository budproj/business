import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionRelayInterface } from '@infrastructure/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@infrastructure/relay/objects/page-info.object'

import { KeyResultCheckInRootEdgeGraphQLObject } from './key-result-check-in-root.edge'
import { KeyResultCheckInGraphQLNode } from './key-result-check-in.node'

@ObjectType('KeyResultCheckIns', {
  implements: () => ConnectionRelayInterface,
  description: 'A list containing key-result comments based on the provided filters and arguments',
})
export class KeyResultCheckInsGraphQLConnection
  implements ConnectionRelayInterface<KeyResultCheckInGraphQLNode> {
  @Field(() => [KeyResultCheckInRootEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultCheckInRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
}
