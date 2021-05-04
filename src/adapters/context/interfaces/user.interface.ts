import { ResourcePolicy } from '@adapters/policy/types/resource-policy.type'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'

export interface UserWithContext extends UserInterface {
  resourcePolicy: ResourcePolicy
  teams: TeamInterface[]
}
