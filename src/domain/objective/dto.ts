import { CycleDTO } from 'src/domain/cycle/dto'
import { UserDTO } from 'src/domain/user/dto'

export class ObjectiveDTO {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  cycleId: CycleDTO['id']
  ownerId: UserDTO['id']
}
