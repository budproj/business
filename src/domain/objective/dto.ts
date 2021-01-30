import { CycleDTO } from 'src/domain/cycle/dto'
import { UserDTO } from 'src/domain/user/dto'

export class ObjectiveDTO {
  public id: string
  public title: string
  public createdAt: Date
  public updatedAt: Date
  public cycleId: CycleDTO['id']
  public ownerId: UserDTO['id']
}
