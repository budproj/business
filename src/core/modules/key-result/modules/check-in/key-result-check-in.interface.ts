import { CoreEntityInterface } from '@core/core-entity.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultInterface } from '../../key-result.interface'

export interface KeyResultCheckInInterface extends CoreEntityInterface {
  value: number
  confidence: number
  keyResultId: KeyResultInterface['id']
  keyResult: KeyResultInterface
  userId: UserInterface['id']
  user: UserInterface
  comment?: string
  parentId?: KeyResultCheckInInterface['id']
  parent?: KeyResultCheckInInterface
}
