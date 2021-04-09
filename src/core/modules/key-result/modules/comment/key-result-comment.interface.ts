import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultInterface } from '../../key-result.interface'

export interface KeyResultCommentInterface {
  id: string
  text: string
  createdAt: Date
  updatedAt: Date
  keyResultId: KeyResultInterface['id']
  keyResult: KeyResultInterface
  userId: UserInterface['id']
  user: UserInterface
}
