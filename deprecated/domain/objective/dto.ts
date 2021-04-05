import { CycleDTO } from 'src/domain/cycle/dto'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { UserDTO } from 'src/domain/user/dto'

export class ObjectiveDTO {
  public id: string
  public title: string
  public createdAt: Date
  public updatedAt: Date
  public cycleId: CycleDTO['id']
  public cycle: CycleDTO
  public ownerId: UserDTO['id']
  public owner: UserDTO
  public keyResults?: KeyResultDTO[]
}
