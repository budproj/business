import { Field, ObjectType } from '@nestjs/graphql'

import { StatusGraphQLInterface } from '@interface/graphql/interfaces/status.interface'
import { ObjectiveStatusObject } from '@interface/graphql/modules/objective/objects/objective-status.object'

@ObjectType('CycleStatus', {
  implements: () => StatusGraphQLInterface,
  description:
    "The current status of this cycle. By status we mean progress, confidence, and other reported values from it's objectives",
})
export class CycleStatusObject implements StatusGraphQLInterface {
  @Field(() => ObjectiveStatusObject, {
    description:
      'The most recent objective status update inside among all objectives for this cycle',
    nullable: true,
  })
  public latestObjectiveStatus?: ObjectiveStatusObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public progress!: number
  public confidence!: number
  public reportDate!: Date
}
