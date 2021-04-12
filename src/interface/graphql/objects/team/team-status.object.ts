import { Field, ObjectType } from '@nestjs/graphql'

import { StatusGraphQLInterface } from '@interface/graphql/interfaces/status.interface'

import { ObjectiveStatusObject } from '../objective/objective-status.object'

@ObjectType('TeamStatus', {
  implements: () => StatusGraphQLInterface,
  description:
    "The current status of this team. By status we mean progress, confidence, and other reported values from it's objectives and their child team's objectives",
})
export class TeamStatusObject implements StatusGraphQLInterface {
  @Field(() => ObjectiveStatusObject, {
    description:
      "The most recent objective status update inside among all objectives for this team and it's child teams",
    nullable: true,
  })
  public latestObjectiveStatus?: ObjectiveStatusObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public progress!: number
  public confidence!: number
}
