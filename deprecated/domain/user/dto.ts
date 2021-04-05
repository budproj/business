import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { TeamDTO } from 'src/domain/team/dto'
import { USER_GENDER } from 'src/domain/user/constants'

export class UserDTO {
  public id: string
  public firstName: string
  public authzSub: string
  public createdAt: Date
  public updatedAt: Date
  public lastName?: string
  public gender?: USER_GENDER
  public role?: string
  public picture?: string
  public nickname?: string
  public about?: string
  public linkedInProfileAddress?: string
  public teams?: Promise<TeamDTO[]> | TeamDTO[]
  public ownedTeams?: TeamDTO[]
  public objectives?: ObjectiveDTO[]
  public keyResults?: KeyResultDTO[]
  public keyResultCheckIns?: KeyResultCheckInDTO[]
}
