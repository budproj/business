import { CompanyDTO } from 'domain/company/dto'

export class TeamDTO {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  companyId: CompanyDTO['id']
}
