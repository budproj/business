import { KeyResultDTO } from 'domain/key-result/dto'
import { UserDTO } from 'domain/user/dto'

import { KEY_RESULT_VIEW_BINDING } from './constants'

export class KeyResultViewDTO {
  id: string
  user: UserDTO
  title?: string
  binding?: KEY_RESULT_VIEW_BINDING
  rank?: Array<KeyResultDTO['id']>
  createdAt: Date
  updatedAt: Date
  userId: UserDTO['id']
}
