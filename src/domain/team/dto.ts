import { UserDTO } from 'domain/user/dto'

import { TEAM_GENDER } from './constants'

export class TeamDTO {
  id: string
  name: string
  description?: string
  gender?: TEAM_GENDER
  createdAt: Date
  updatedAt: Date
  ownerId: UserDTO['id']
  parentTeamId?: TeamDTO['id']
}
