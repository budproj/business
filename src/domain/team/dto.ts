import { UserDTO } from 'src/domain/user/dto'

import { TEAM_GENDER } from './constants'

export class TeamDTO {
  public id: string
  public name: string
  public description?: string
  public gender?: TEAM_GENDER
  public createdAt: Date
  public updatedAt: Date
  public ownerId: UserDTO['id']
  public parentId?: TeamDTO['id']
}
