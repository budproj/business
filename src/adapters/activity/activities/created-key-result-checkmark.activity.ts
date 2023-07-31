import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'
import { GraphQLRequest } from '@interface/graphql/adapters/context/interfaces/request.interface'

import { Activity } from './base.activity'

export const CREATED_KEY_RESULT_CHECKMARK_ACTIVITY_TYPE = 'ACTIVITY::KEY-RESULT::CHECKMARK::CREATED'

export class CreatedKeyResultCheckMarkActivity extends Activity<KeyResultCheckMark> {
  public type = CREATED_KEY_RESULT_CHECKMARK_ACTIVITY_TYPE

  constructor(public readonly data: KeyResultCheckMark, public readonly context: Partial<GraphQLRequest>) {
    super(data, context)
  }
}
