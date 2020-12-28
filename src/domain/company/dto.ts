import { UserDTO } from 'domain/user/dto'

export class CompanyDTO {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  ownerId: UserDTO['id']
}
