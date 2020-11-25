import { KeyResultDTO } from 'domain/key-result/dto'
import { UserDTO } from 'domain/user/dto'

export enum KeyResultViewBinding {
  MINE = 'MINE',
}

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
