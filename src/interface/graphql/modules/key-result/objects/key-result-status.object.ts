import { Field, ObjectType } from '@nestjs/graphql'

import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { StatusGraphQLInterface } from '@interface/graphql/interfaces/status.interface'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/modules/key-result/check-in/key-result-check-in.node'

@ObjectType('KeyResultStatus', {
  implements: () => StatusGraphQLInterface,
  description:
    'The current status of this key-result. By status we mean progress, confidence, and other reported values',
})
export class KeyResultStatusObject implements StatusGraphQLInterface {
  @Field(() => KeyResultCheckInGraphQLNode, {
    description: 'The most recent check-in inside all this key-result check-ins',
    nullable: true,
  })
  public latestKeyResultCheckIn?: KeyResultCheckInGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public progress!: number
  public confidence!: number
  public reportDate?: Date
  public latestCheckIn?: KeyResultCheckIn
}
