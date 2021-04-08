import { TeamInterface } from '@core/modules/team/team.interface'

import { Cadence } from './enums/cadence.enum'

export interface CycleInterface {
  id: string
  period: string
  cadence: Cadence
  active: boolean
  dateStart: Date
  dateEnd: Date
  createdAt: Date
  updatedAt: Date
  teamId: TeamInterface['id']
  team: TeamInterface
  parentId?: CycleInterface['id']
  parent?: CycleInterface
  cycles?: CycleInterface[]
}
