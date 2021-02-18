import { FindConditions } from 'typeorm'

import { CycleDTO } from 'src/domain/cycle/dto'

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

export interface TeamFilters {
  cycleID?: CycleDTO['id']
}
