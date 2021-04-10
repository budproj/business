import { CoreEntityInterface } from '@core/core-entity.interface'

import { Cadence } from './enums/cadence.enum'

export interface CycleInterface extends CoreEntityInterface {
  period: string
  cadence: Cadence
  active: boolean
  dateStart: Date
  dateEnd: Date
  updatedAt: Date
  teamId: string
  parentId?: string
}
