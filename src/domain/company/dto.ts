import { COMPANY_GENDER } from 'domain/company/constants'
import { UserDTO } from 'domain/user/dto'

export class CompanyDTO {
  id: string
  name: string
  gender?: COMPANY_GENDER
  description?: string
  createdAt: Date
  updatedAt: Date
  ownerId: UserDTO['id']
}
