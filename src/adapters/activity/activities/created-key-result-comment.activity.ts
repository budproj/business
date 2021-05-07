import { State } from '@adapters/state/interfaces/state.interface'
import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'

import { Activity } from './base.activity'

export const CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE = 'ACTIVITY::KEY-RESULT::COMMENT::CREATED'

export class CreatedKeyResultCommentActivity extends Activity<KeyResultComment> {
  public type = CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE

  constructor(public readonly data: KeyResultComment, public readonly context: State) {
    super(data, context)
  }
}
