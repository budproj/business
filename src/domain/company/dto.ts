import { UserDTO } from 'domain/user/dto'

export class CompanyDTO {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  ownerId: UserDTO['id']
}
