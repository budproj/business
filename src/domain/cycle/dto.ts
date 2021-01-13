import { TeamDTO } from 'src/domain/team/dto'

export class CycleDTO {
  id: string
  dateStart: Date
  dateEnd: Date
  createdAt: Date
  updatedAt: Date
  teamId: TeamDTO['id']
  name?: string
}
