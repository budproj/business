import { KeyResultDTO } from 'src/domain/key-result/dto'
import { UserDTO } from 'src/domain/user/dto'

import { KEY_RESULT_CUSTOM_LIST_BINDING } from './constants'

export class KeyResultCustomListDTO {
  id: string
  user: UserDTO
  createdAt: Date
  updatedAt: Date
  userId: UserDTO['id']
  title?: string
  binding?: KEY_RESULT_CUSTOM_LIST_BINDING
  rank?: Array<KeyResultDTO['id']>
}
