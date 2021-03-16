import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
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
  public owner: UserDTO
  public objectiveId: ObjectiveDTO['id']
  public objective: ObjectiveDTO
  public teamId: TeamDTO['id']
  public team: TeamDTO
  public description?: string
  public checkIns?: KeyResultCheckInDTO[]
}
