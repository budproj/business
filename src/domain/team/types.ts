import { FindConditions } from 'typeorm'

import { Team } from './entities'

export type TeamEntitySelector = keyof Team

export type TeamEntityRelation =
  | 'keyResults'
  | 'users'
  | 'owner'
  | 'parentTeam'
  | 'teams'
  | 'cycles'

export interface TeamSelector extends FindConditions<Team> {
  parentTeamId?: Team['parentTeamId']
  onlyCompanies?: boolean
}
