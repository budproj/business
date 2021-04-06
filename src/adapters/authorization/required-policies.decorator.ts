import { SetMetadata } from '@nestjs/common'

import { Policy } from './types/policy.type'

export const RequiredPolicies = (...requiredPolicies: Policy[]) =>
  SetMetadata('requiredPolicies', requiredPolicies)
