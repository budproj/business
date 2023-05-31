import { CoreEntityInterface } from '@core/core-entity.interface'

import { KeyResultCommentType } from '../enums/key-result-comment-type.enum'

export interface KeyResultCommentInterface extends CoreEntityInterface {
  text: string
  updatedAt: Date
  keyResultId: string
  userId: string
  type: KeyResultCommentType
  extra?: any
}
