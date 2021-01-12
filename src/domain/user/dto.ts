import { TeamDTO } from 'domain/team/dto'
import { USER_GENDER } from 'domain/user/constants'

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
