import { KeyResultDTO } from 'domain/objective-aggregate/key-result/dto'
import { UserDTO } from 'domain/user-aggregate/user/dto'

export enum KeyResultViewBinding {
  MINE = 'MINE',
}

export class KeyResultViewDTO {
  id: number
  user: UserDTO
  title: string
  binding: KeyResultViewBinding
  rank: Array<KeyResultDTO['id']>
  createdAt: Date
  updatedAt: Date
}
