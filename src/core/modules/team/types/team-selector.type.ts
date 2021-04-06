import { FindConditions } from 'typeorm'

import { TeamORMEntity } from '@core/modules/team/team.orm-entity'

export interface TeamSelector extends FindConditions<TeamORMEntity> {
  parentId?: TeamORMEntity['parentId']
  onlyCompanies?: boolean
}
