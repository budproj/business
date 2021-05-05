import { Context } from '@adapters/context/interfaces/context.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

import { Activity } from './base.activity'

export const CREATED_CHECK_IN_ACTIVITY_TYPE = 'ACTIVITY::CHECK-IN::CREATED'

export class CreatedCheckInActivity extends Activity<KeyResultCheckIn> {
  public type = CREATED_CHECK_IN_ACTIVITY_TYPE

  constructor(public readonly data: KeyResultCheckIn, public readonly context: Context) {
    super(data, context)
  }
}
