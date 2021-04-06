import { TeamInterface } from '@core/modules/team/team.interface'

export interface QueryContext {
  companies: TeamInterface[]
  teams: TeamInterface[]
  userTeams: TeamInterface[]
}
