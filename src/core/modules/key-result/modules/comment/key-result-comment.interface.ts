import { CoreEntityInterface } from '@core/core-entity.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultInterface } from '../../key-result.interface'

export interface KeyResultCommentInterface extends CoreEntityInterface {
  text: string
  updatedAt: Date
  keyResultId: KeyResultInterface['id']
  keyResult: KeyResultInterface
  userId: UserInterface['id']
  user: UserInterface
}
