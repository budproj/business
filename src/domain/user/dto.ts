import { TeamDTO } from 'src/domain/team/dto'
import { USER_GENDER } from 'src/domain/user/constants'

export class UserDTO {
  id: string
  firstName: string
  lastName?: string
  authzSub: string
  gender?: USER_GENDER
  role?: string
  picture?: string
  createdAt: Date
  updatedAt: Date
  teams?: Promise<TeamDTO[]> | TeamDTO[]
}
