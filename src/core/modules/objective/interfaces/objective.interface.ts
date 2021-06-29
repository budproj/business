import { CoreEntityInterface } from '@core/core-entity.interface'

export interface ObjectiveInterface extends CoreEntityInterface {
  title: string
  updatedAt: Date
  cycleId: string
  ownerId: string
  teamId: string
}
