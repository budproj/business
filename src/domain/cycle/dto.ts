import { CADENCE } from 'src/domain/cycle/constants'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { TeamDTO } from 'src/domain/team/dto'

export class CycleDTO {
  public id: string
  public title: string
  public cadence: CADENCE
  public active: boolean
  public dateStart: Date
  public dateEnd: Date
  public createdAt: Date
  public updatedAt: Date
  public teamId: TeamDTO['id']
  public team: TeamDTO
  public parentId?: CycleDTO['id']
  public parent?: CycleDTO
  public objectives?: ObjectiveDTO[]
  public cycles?: CycleDTO[]
}
