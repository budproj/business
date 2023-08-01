import { Field, ObjectType } from '@nestjs/graphql'

import { GetCheckListProgressCommandResult } from '@core/ports/commands/get-check-list-progress.command'
import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { KeyResultCheckMarkGraphQLNode } from '../../check-mark/key-result-check-mark.node'

import { KeyResultKeyResultCheckMarkEdgeGraphQLObject } from './key-result-key-result-check-mark.edge'

@ObjectType('CheckMarkProgress', {
  description:
    'An object containing information about how many check items are checked in a checklist',
})
export class CheckMarkProgress {
  @Field(() => Number, { complexity: 0 })
  numberOfChecked: number

  @Field(() => Number, { complexity: 0 })
  progress: number

  @Field(() => Number, { complexity: 0 })
  total: number
}

@ObjectType('KeyResultKeyResultCheckList', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description:
    'A list containing key-results check marks based on the provided filters and arguments',
})
export class KeyResultKeyResultCheckMarkGraphQLConnection
  implements GuardedConnectionGraphQLInterface<KeyResultCheckMarkGraphQLNode>
{
  @Field(() => [KeyResultKeyResultCheckMarkEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultKeyResultCheckMarkEdgeGraphQLObject[]

  @Field(() => CheckMarkProgress, { complexity: 1 })
  public readonly progress: GetCheckListProgressCommandResult

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
