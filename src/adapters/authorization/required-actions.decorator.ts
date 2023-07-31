import { SetMetadata } from '@nestjs/common'

import { Action } from '../policy/types/action.type'

export const RequiredActions = (...requiredActions: Action[]) => SetMetadata('requiredActions', requiredActions)
