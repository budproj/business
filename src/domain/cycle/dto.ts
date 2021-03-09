import { CADENCE } from 'src/domain/cycle/constants'
import { TeamDTO } from 'src/domain/team/dto'

export class CycleDTO {
  public id: string
  public name: string
  public cadence: CADENCE
  public active: boolean
  public dateStart: Date
  public dateEnd: Date
  public createdAt: Date
  public updatedAt: Date
  public teamId: TeamDTO['id']
  public fiscalYear: number
  public quarter?: number
}
