import { Injectable } from '@nestjs/common'

import { CycleDTO } from 'domain/cycle/dto'
import DomainEntityService from 'domain/service'
import { TeamDTO } from 'domain/team/dto'

import { Cycle } from './entities'
import DomainCycleRepository from './repository'

@Injectable()
class DomainCycleService extends DomainEntityService<Cycle, CycleDTO> {
  constructor(public readonly repository: DomainCycleRepository) {
    super(repository, DomainCycleService.name)
  }

  async getFromCompany(companyId: TeamDTO['id']): Promise<Cycle[]> {
    // TODO
    return this.repository.find({ teamId: companyId })
  }
}

export default DomainCycleService
