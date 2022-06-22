import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'
import { GraphQLRequest } from '@interface/graphql/adapters/context/interfaces/request.interface'

import { Activity } from './base.activity'

export const CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE = 'ACTIVITY::KEY-RESULT::COMMENT::CREATED'

export class CreatedKeyResultCommentActivity extends Activity<KeyResultComment> {
  public type = CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE

  constructor(
    public readonly data: KeyResultComment,
    public readonly context: Partial<GraphQLRequest>,
  ) {
    super(data, context)
  }
}
