import { Field, ObjectType } from '@nestjs/graphql'

import { StatusGraphQLInterface } from '@interface/graphql/interfaces/status.interface'

import { KeyResultCheckInGraphQLNode } from '../key-result/check-in/key-result-check-in.node'

@ObjectType('ObjectiveStatus', {
  implements: () => StatusGraphQLInterface,
  description:
    "The current status of this objective. By status we mean progress, confidence, and other reported values from it's key results",
})
export class ObjectiveStatusObject implements StatusGraphQLInterface {
  @Field(() => KeyResultCheckInGraphQLNode, {
    description: 'The latest reported check-in among all key results of that objective',
    nullable: true,
  })
  public latestKeyResultCheckIn?: KeyResultCheckInGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public progress!: number
  public confidence!: number
}
