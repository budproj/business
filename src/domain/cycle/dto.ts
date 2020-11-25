import { CompanyDTO } from 'domain/company/dto'

export class CycleDTO {
  id: number
  dateStart: Date
  dateEnd: Date
  createdAt: Date
  updatedAt: Date
  companyId: CompanyDTO['id']
}
