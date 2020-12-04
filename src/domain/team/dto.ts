import { CompanyDTO } from 'domain/company/dto'
import { UserDTO } from 'domain/user/dto'

export class TeamDTO {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  companyId: CompanyDTO['id']
  ownerId: UserDTO['id']
}
