import { Injectable } from '@nestjs/common'

import { CompanyDTO } from 'domain/company/dto'

import { Cycle } from './entities'
import CycleRepository from './repository'

@Injectable()
class CycleService {
  constructor(private readonly repository: CycleRepository) {}

  async getOneById(id: Cycle['id']): Promise<Cycle> {
    return this.repository.findOne({ id })
  }

  async getFromCompany(companyId: CompanyDTO['id']): Promise<Cycle[]> {
    return this.repository.find({ companyId })
  }
}

export default CycleService
