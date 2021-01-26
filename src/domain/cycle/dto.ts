import { TeamDTO } from 'src/domain/team/dto'

export class CycleDTO {
  public id: string
  public dateStart: Date
  public dateEnd: Date
  public createdAt: Date
  public updatedAt: Date
  public teamId: TeamDTO['id']
  public name?: string
}
