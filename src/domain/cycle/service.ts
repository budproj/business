import { Injectable } from '@nestjs/common'

import { CompanyDTO } from 'domain/company/dto'
import { CycleDTO } from 'domain/cycle/dto'
import DomainEntityService from 'domain/service'

import { Cycle } from './entities'
import DomainCycleRepository from './repository'

@Injectable()
class DomainCycleService extends DomainEntityService<Cycle, CycleDTO> {
  constructor(public readonly repository: DomainCycleRepository) {
    super(repository, DomainCycleService.name)
  }

  async getFromCompany(companyId: CompanyDTO['id']): Promise<Cycle[]> {
    return this.repository.find({ companyId })
  }
}

export default DomainCycleService
