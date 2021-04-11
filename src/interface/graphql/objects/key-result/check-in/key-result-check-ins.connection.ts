import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '../../../authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '../../../authorization/objects/policy.object'
import { ConnectionRelayInterface } from '../../../relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '../../../relay/objects/page-info.object'

import { KeyResultCheckInRootEdgeGraphQLObject } from './key-result-check-in-root.edge'
import { KeyResultCheckInGraphQLNode } from './key-result-check-in.node'

@ObjectType('KeyResultCheckIns', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing key-result comments based on the provided filters and arguments',
})
export class KeyResultCheckInsGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultCheckInGraphQLNode> {
  @Field(() => [KeyResultCheckInRootEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultCheckInRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
