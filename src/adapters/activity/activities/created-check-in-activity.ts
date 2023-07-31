import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { GraphQLRequest } from '@interface/graphql/adapters/context/interfaces/request.interface'

import { Activity } from './base.activity'

export const CREATED_CHECK_IN_ACTIVITY_TYPE = 'ACTIVITY::KEY-RESULT::CHECK-IN::CREATED'

export class CreatedCheckInActivity extends Activity<KeyResultCheckIn> {
  public type = CREATED_CHECK_IN_ACTIVITY_TYPE

  constructor(public readonly data: KeyResultCheckIn, public readonly context: Partial<GraphQLRequest>) {
    super(data, context)
  }
}
