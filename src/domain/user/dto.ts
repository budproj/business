import { TeamDTO } from 'src/domain/team/dto'
import { USER_GENDER } from 'src/domain/user/constants'

export class UserDTO {
  public id: string
  public firstName: string
  public lastName?: string
  public authzSub: string
  public gender?: USER_GENDER
  public role?: string
  public picture?: string
  public createdAt: Date
  public updatedAt: Date
  public teams?: Promise<TeamDTO[]> | TeamDTO[]
}
