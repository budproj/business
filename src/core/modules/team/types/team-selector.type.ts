import { FindConditions } from 'typeorm'

import { TeamEntity } from '@core/modules/team/team.entity'

export interface TeamSelector extends FindConditions<TeamEntity> {
  parentId?: TeamEntity['parentId']
  onlyCompanies?: boolean
}
