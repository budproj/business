import { CoreEntityInterface } from '@core/core-entity.interface'
import { TeamInterface } from '@core/modules/team/team.interface'

import { Cadence } from './enums/cadence.enum'

export interface CycleInterface extends CoreEntityInterface {
  period: string
  cadence: Cadence
  active: boolean
  dateStart: Date
  dateEnd: Date
  updatedAt: Date
  teamId: TeamInterface['id']
  team: TeamInterface
  parentId?: CycleInterface['id']
  parent?: CycleInterface
  cycles?: CycleInterface[]
}
