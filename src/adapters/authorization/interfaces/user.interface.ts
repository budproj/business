import { ResourcePolicy } from '@adapters/policy/types/resource-policy.type'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { AuthzToken } from '@infrastructure/authz/interfaces/authz-token.interface'

export interface AuthorizationUser extends UserInterface {
  token: AuthzToken
  resourcePolicy: ResourcePolicy
  teams: TeamInterface[]
}
