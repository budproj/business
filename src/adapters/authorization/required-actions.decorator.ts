import { SetMetadata } from '@nestjs/common'

import { Action } from './types/action.type'

export const RequiredActions = (...requiredActions: Action[]) =>
  SetMetadata('requiredActions', requiredActions)
