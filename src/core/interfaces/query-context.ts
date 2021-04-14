import { TeamInterface } from '../modules/team/interfaces/team.interface'

export interface QueryContext {
  companies: TeamInterface[]
  teams: TeamInterface[]
  userTeams: TeamInterface[]
}
