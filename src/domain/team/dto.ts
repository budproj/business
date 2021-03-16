import { CycleDTO } from 'src/domain/cycle/dto'
import { KeyResultDTO } from 'src/domain/key-result/dto'
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
  public owner: UserDTO
  public parentId?: TeamDTO['id']
  public parent?: TeamDTO
  public teams?: TeamDTO[]
  public cycles?: CycleDTO[]
  public keyResults?: KeyResultDTO[]
}
