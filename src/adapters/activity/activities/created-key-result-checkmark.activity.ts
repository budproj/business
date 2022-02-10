import { State } from '@adapters/state/interfaces/state.interface'
import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'

import { Activity } from './base.activity'

export const CREATED_KEY_RESULT_CHECKMARK_ACTIVITY_TYPE = 'ACTIVITY::KEY-RESULT::CHECKMARK::CREATED'

export class CreatedKeyResultCheckMarkActivity extends Activity<KeyResultCheckMark> {
  public type = CREATED_KEY_RESULT_CHECKMARK_ACTIVITY_TYPE

  constructor(public readonly data: KeyResultCheckMark, public readonly context: State) {
    super(data, context)
  }
}
