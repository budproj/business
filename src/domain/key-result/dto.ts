import { ObjectiveDTO } from 'domain/objective/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

export enum KeyResultFormat {
  NUMBER = 'NUMBER',
  PERCENTAGE = 'PERCENTAGE',
  COIN_BRL = 'COIN_BRL',
}

export class KeyResultDTO {
  id: number
  title: string
  description?: string
  initialValue: number
  goal: number
  format: KeyResultFormat
  createdAt: Date
  updatedAt: Date
  ownerId: UserDTO['id']
  objectiveId: ObjectiveDTO['id']
  teamId: TeamDTO['id']
}
