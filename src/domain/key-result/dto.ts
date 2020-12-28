import { KeyResultFormat } from 'domain/key-result/types'
import { ObjectiveDTO } from 'domain/objective/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

export class KeyResultDTO {
  id: string
  title: string
  description?: string
  initialValue: number
  goal: number
  format: KeyResultFormat
  createdAt: Date
  updatedAt: Date
  ownerId: UserDTO['id']
  objectiveId: ObjectiveDTO['id']
  teamId: TeamDTO['id']
}
