import { CoreEntityInterface } from '@core/core-entity.interface'

export interface ProgressRecord extends CoreEntityInterface {
  updatedAt: Date
  progress: number
  keyResultId: string
  keyResultCheckInId: string
  date: Date
}
