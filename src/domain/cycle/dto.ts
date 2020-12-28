import { CompanyDTO } from 'domain/company/dto'

export class CycleDTO {
  id: string
  dateStart: Date
  dateEnd: Date
  createdAt: Date
  updatedAt: Date
  companyId: CompanyDTO['id']
}
