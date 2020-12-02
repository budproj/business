import { KeyResultDTO } from 'domain/key-result/dto'
import { UserDTO } from 'domain/user/dto'

import { KeyResultViewBinding } from './types'

export class KeyResultViewDTO {
  id: number
  user: UserDTO
  title?: string
  binding?: KeyResultViewBinding
  rank: Array<KeyResultDTO['id']>
  createdAt: Date
  updatedAt: Date
  userId: UserDTO['id']
}
