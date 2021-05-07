import { State } from '@adapters/state/interfaces/state.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { Activity } from './base.activity'

export const UPDATED_KEY_RESULT_ACTIVITY_TYPE = 'ACTIVITY::KEY-RESULT::UPDATED'

interface UpdatedKeyResultContext extends State {
  originalKeyResult: KeyResult
}

export class UpdatedKeyResultActivity extends Activity<KeyResult, UpdatedKeyResultContext> {
  public type = UPDATED_KEY_RESULT_ACTIVITY_TYPE

  constructor(public readonly data: KeyResult, public context: UpdatedKeyResultContext) {
    super(data, context)
  }
}
