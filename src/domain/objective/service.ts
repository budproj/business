import { Injectable } from '@nestjs/common'

import { CycleDTO } from 'domain/cycle/dto'
import { ObjectiveDTO } from 'domain/objective/dto'
import DomainService from 'domain/service'

import { Objective } from './entities'
import DomainObjectiveRepository from './repository'

@Injectable()
class DomainObjectiveService extends DomainService<Objective, ObjectiveDTO> {
  constructor(public readonly repository: DomainObjectiveRepository) {
    super(repository, DomainObjectiveService.name)
  }

  async getFromCycle(cycleId: CycleDTO['id']): Promise<Objective[]> {
    return this.repository.find({ cycleId })
  }
}

export default DomainObjectiveService
