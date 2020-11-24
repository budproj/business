import { Injectable } from '@nestjs/common'

import { CycleDTO } from 'domain/cycle/dto'

import { Objective } from './entities'
import ObjectiveRepository from './repository'

@Injectable()
class ObjectiveService {
  constructor(private readonly repository: ObjectiveRepository) {}

  async getOneById(id: Objective['id']): Promise<Objective> {
    return this.repository.findOne({ id })
  }

  async getFromCycle(cycleId: CycleDTO['id']): Promise<Objective[]> {
    return this.repository.find({ cycleId })
  }
}

export default ObjectiveService
