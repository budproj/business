import { KeyResultDTO } from 'src/domain/key-result/dto'
import { UserDTO } from 'src/domain/user/dto'

export class KeyResultCommentDTO {
  public id: string
  public text: string
  public createdAt: Date
  public updatedAt: Date
  public keyResultId: KeyResultDTO['id']
  public keyResult: KeyResultDTO
  public userId: UserDTO['id']
  public user: UserDTO
}
