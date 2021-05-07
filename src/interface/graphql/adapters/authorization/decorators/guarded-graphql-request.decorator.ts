import { applyDecorators } from '@nestjs/common'

import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { Action } from '@adapters/policy/types/action.type'

export function GuardedGraphQLRequest(actions: Action[] | Action) {
  const requiredActionsArguments = Array.isArray(actions) ? actions : [actions]

  return applyDecorators(RequiredActions(...requiredActionsArguments))
}
