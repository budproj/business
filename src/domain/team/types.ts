import { FindConditions } from 'typeorm'

import { Team } from './entities'

export type TeamEntitySelector = keyof Team

export type TeamEntityRelation = 'keyResults' | 'users' | 'owner' | 'parent' | 'teams' | 'cycles'

export interface TeamSelector extends FindConditions<Team> {
  parentId?: Team['parentId']
  onlyCompanies?: boolean
}
