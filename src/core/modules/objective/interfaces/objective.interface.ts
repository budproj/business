import { CoreEntityInterface } from '@core/core-entity.interface'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'

export interface ObjectiveInterface extends CoreEntityInterface {
  title: string
  updatedAt: Date
  cycleId: string
  ownerId: string
  teamId?: string
  description?: string
  cycle: CycleInterface
}
