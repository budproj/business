import { TeamDTO } from 'domain/team/dto'

export class UserDTO {
  id: number
  authzSub: string
  role?: string
  picture?: string
  createdAt: Date
  updatedAt: Date
  teams: Promise<TeamDTO[]>
}
