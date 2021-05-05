import { Context } from '@adapters/context/interfaces/context.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

import { Activity } from '../interfaces/activity.interface'
import { ActivityMetadata } from '../types/activity-metadata.type'

const ACTIVITY_TYPE = 'CREATED_CHECK_IN'

export class CreatedCheckInActivity implements Activity {
  public readonly metadata: ActivityMetadata

  constructor(public readonly data: KeyResultCheckIn, context: Context) {
    this.metadata = this.marshalMetadata(context)
  }

  private marshalMetadata(context: Context): ActivityMetadata {
    return {
      type: ACTIVITY_TYPE,
      userID: context.user.id,
      sessionID: context.tracing.sessionID,
      timestamp: Date.now(),
    }
  }
}
