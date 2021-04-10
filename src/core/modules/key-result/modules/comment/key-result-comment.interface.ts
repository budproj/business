import { CoreEntityInterface } from '@core/core-entity.interface'

export interface KeyResultCommentInterface extends CoreEntityInterface {
  text: string
  updatedAt: Date
  keyResultId: string
  userId: string
}
