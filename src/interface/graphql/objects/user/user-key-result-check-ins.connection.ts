import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '../../authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '../../authorization/objects/policy.object'
import { ConnectionRelayInterface } from '../../relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '../../relay/objects/page-info.object'
import { KeyResultCheckInGraphQLNode } from '../key-result/check-in/key-result-check-in.node'

import { UserKeyResultCheckInEdgeGraphQLObject } from './user-key-result-check-in.edge'

@ObjectType('UserKeyResultCheckIns', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description:
    'A list containing a given user key-results based on the provided filters and arguments',
})
export class UserKeyResultCheckInsGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultCheckInGraphQLNode> {
  @Field(() => [UserKeyResultCheckInEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: UserKeyResultCheckInEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
