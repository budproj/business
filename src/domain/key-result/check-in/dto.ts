import { KeyResultDTO } from 'src/domain/key-result/dto'
import { UserDTO } from 'src/domain/user/dto'

export class KeyResultCheckInDTO {
  public id: string
  public value: number
  public confidence: number
  public createdAt: Date
  public keyResultId: KeyResultDTO['id']
  public userId: UserDTO['id']
  public user: UserDTO
  public comment?: string
  public parentId?: KeyResultCheckInDTO['id']
  public parent?: KeyResultCheckInDTO
}
