import { Injectable } from '@nestjs/common'

import { CycleDTO } from 'domain/company-aggregate/cycle/dto'

import { ObjectiveDTO } from './dto'
import ObjectiveRepository from './repository'

@Injectable()
class ObjectiveService {
  constructor(private readonly repository: ObjectiveRepository) {}

  async getCycle(objective: ObjectiveDTO): Promise<CycleDTO> {
    const { id } = objective
    const cycle = await this.repository.selectRelatedCycle(id)

    return cycle
  }
}

export default ObjectiveService
