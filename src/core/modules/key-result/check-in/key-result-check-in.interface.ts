import { CoreEntityInterface } from '@core/core-entity.interface'

export interface KeyResultCheckInInterface extends CoreEntityInterface {
  value: number
  confidence: number
  keyResultId: string
  userId: string
  comment?: string
  parentId?: string
}
