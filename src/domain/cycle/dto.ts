import { TeamDTO } from 'domain/team/dto'

export class CycleDTO {
  id: string
  dateStart: Date
  dateEnd: Date
  createdAt: Date
  updatedAt: Date
  teamId: TeamDTO['id']
}
