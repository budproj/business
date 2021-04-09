import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultInterface } from '../../key-result.interface'

export interface KeyResultCheckInInterface {
  id: string
  value: number
  confidence: number
  createdAt: Date
  keyResultId: KeyResultInterface['id']
  keyResult: KeyResultInterface
  userId: UserInterface['id']
  user: UserInterface
  comment?: string
  parentId?: KeyResultCheckInInterface['id']
  parent?: KeyResultCheckInInterface
}
