import { ObjectType } from '@nestjs/graphql'

import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { StatusGraphQLInterface } from '@interface/graphql/interfaces/status.interface'

@ObjectType('TeamStatus', {
  implements: () => StatusGraphQLInterface,
  description:
    "The current status of this team. By status we mean progress, confidence, and other reported values from it's objectives and their child team's objectives",
})
export class TeamStatusObject implements StatusGraphQLInterface {
  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public progress!: number
  public confidence!: number
  public reportDate?: Date
  public latestCheckIn?: KeyResultCheckIn
}
