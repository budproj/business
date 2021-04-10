import { TeamInterface } from '@core/modules/team/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { ResourcePolicy } from '../types/resource-policy.type'

import { AuthzToken } from './authz-token.interface'

export interface AuthorizationUser extends UserInterface {
  token: AuthzToken
  resourcePolicy: ResourcePolicy
  teams: TeamInterface[]
}
