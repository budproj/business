import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { GraphQLRequest } from '@interface/graphql/adapters/context/interfaces/request.interface'

import { Activity } from './base.activity'

export const NEW_KEY_RESULT_SUPPORT_TEAM_MEMBER_ACTIVITY_TYPE =
  'ACTIVITY::KEY-RESULT::SUPPORT_TEAM::NEW_MEMBER'

type Request = {
  keyResultId: string
  userId: string
}

export class NewKeyResultSupportTeamMemberActivity extends Activity<KeyResult> {
  public type = NEW_KEY_RESULT_SUPPORT_TEAM_MEMBER_ACTIVITY_TYPE

  constructor(
    public readonly data: KeyResult,
    public readonly context: Partial<GraphQLRequest>,
    public readonly request: Request,
  ) {
    super(data, context, request)
  }
}
