import { KEY_RESULT_FORMAT } from 'domain/key-result/constants'
import { ObjectiveDTO } from 'domain/objective/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

export class KeyResultDTO {
  id: string
  title: string
  description?: string
  initialValue: number
  goal: number
  format: KEY_RESULT_FORMAT
  createdAt: Date
  updatedAt: Date
  ownerId: UserDTO['id']
  objectiveId: ObjectiveDTO['id']
  teamId: TeamDTO['id']
}
