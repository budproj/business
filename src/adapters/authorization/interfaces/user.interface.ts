import { ResourcePolicy } from '@adapters/authorization/types/resource-policy.type'
import { UserInterface } from '@core/modules/user/user.interface'

import { AuthzToken } from './authz-token.interface'

export interface AuthorizationUser extends UserInterface {
  token: AuthzToken
  resourcePolicies: ResourcePolicy
}
