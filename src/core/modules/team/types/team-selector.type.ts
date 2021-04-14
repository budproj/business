import { FindConditions } from 'typeorm'

import { Team } from '../team.orm-entity'

export interface TeamSelector extends FindConditions<Team> {
  parentId?: Team['parentId']
  onlyCompanies?: boolean
}
