import { UserDTO } from 'domain/user/dto'

export class KeyResultDTO {
  id: number
  title: string
  description?: string
  initialValue: number
  goal: number
  createdAt: Date
  updatedAt: Date
  ownerId: UserDTO['id']
}
