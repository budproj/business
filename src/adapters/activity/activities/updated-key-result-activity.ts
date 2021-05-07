import { Context } from '@adapters/context/interfaces/context.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

import { Activity } from './base.activity'

export const UPDATED_KEY_RESULT_ACTIVITY_TYPE = 'ACTIVITY::KEY-RESULT::UPDATED'

export class UpdatedKeyResultActivity extends Activity<KeyResultCheckIn> {
  public type = UPDATED_KEY_RESULT_ACTIVITY_TYPE

  constructor(public readonly data: KeyResultCheckIn, public readonly context: Context) {
    super(data, context)
  }
}
