import { CoreEntityInterface } from '@core/core-entity.interface'

import { KeyResultStateInterface } from '../interfaces/key-result-state.interface'

export interface KeyResultCheckInInterface extends CoreEntityInterface {
  value: number
  confidence: number
  keyResultId: string
  userId: string
  comment?: string
  parentId?: string
  previousState?: KeyResultStateInterface
}
