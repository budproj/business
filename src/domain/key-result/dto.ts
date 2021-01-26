import { KEY_RESULT_FORMAT } from 'src/domain/key-result/constants'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

export class KeyResultDTO {
  public id: string
  public title: string
  public initialValue: number
  public goal: number
  public format: KEY_RESULT_FORMAT
  public createdAt: Date
  public updatedAt: Date
  public ownerId: UserDTO['id']
  public objectiveId: ObjectiveDTO['id']
  public teamId: TeamDTO['id']
  public description?: string
}
