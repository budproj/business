import { Injectable } from '@nestjs/common'

import { ICycle } from 'domain/company-aggregate/cycle/dto'

import { IObjective } from './dto'
import ObjectiveRepository from './repository'

@Injectable()
class ObjectiveService {
  constructor(private readonly repository: ObjectiveRepository) {}

  async getCycle(objective: IObjective): Promise<ICycle> {
    const { id } = objective
    const cycle = await this.repository.selectRelatedCycle(id)

    return cycle
  }
}

export default ObjectiveService
