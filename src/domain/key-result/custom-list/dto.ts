import { KeyResultDTO } from 'src/domain/key-result/dto'
import { UserDTO } from 'src/domain/user/dto'

import { KEY_RESULT_CUSTOM_LIST_BINDING } from './constants'

export class KeyResultCustomListDTO {
  public id: string
  public user: UserDTO
  public createdAt: Date
  public updatedAt: Date
  public userId: UserDTO['id']
  public title?: string
  public binding?: KEY_RESULT_CUSTOM_LIST_BINDING
  public rank?: Array<KeyResultDTO['id']>
}
