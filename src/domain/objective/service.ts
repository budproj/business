import { Injectable } from '@nestjs/common'

import { CycleDTO } from 'domain/cycle/dto'
import { ObjectiveDTO } from 'domain/objective/dto'
import DomainEntityService from 'domain/service'
import { UserDTO } from 'domain/user'

import { Objective } from './entities'
import DomainObjectiveRepository from './repository'

@Injectable()
class DomainObjectiveService extends DomainEntityService<Objective, ObjectiveDTO> {
  constructor(public readonly repository: DomainObjectiveRepository) {
    super(repository, DomainObjectiveService.name)
  }

  async getFromCycle(cycleId: CycleDTO['id']): Promise<Objective[]> {
    return this.repository.find({ cycleId })
  }

  async getFromOwner(ownerId: UserDTO['id']): Promise<Objective[]> {
    return this.repository.find({ ownerId })
  }
}

export default DomainObjectiveService
