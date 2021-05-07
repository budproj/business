import { Context } from '@adapters/context/interfaces/context.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { Activity } from './base.activity'

export const CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE = 'ACTIVITY::KEY-RESULT::COMMENT::CREATED'

export class CreatedKeyResultCommentActivity extends Activity<KeyResult> {
  public type = CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE

  constructor(public readonly data: KeyResult, public readonly context: Context) {
    super(data, context)
  }
}
