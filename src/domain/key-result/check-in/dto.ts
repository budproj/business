import { KeyResultDTO } from 'src/domain/key-result/dto'
import { UserDTO } from 'src/domain/user/dto'

export class KeyResultCheckInDTO {
  public id: string
  public progress: number
  public confidence: number
  public createdAt: Date
  public keyResultId: KeyResultDTO['id']
  public userId: UserDTO['id']
  public comment?: string
}
