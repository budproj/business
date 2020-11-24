import { Injectable } from '@nestjs/common'

import { Objective } from './entities'
import ObjectiveRepository from './repository'

@Injectable()
class ObjectiveService {
  constructor(private readonly repository: ObjectiveRepository) {}

  async getOneById(id: Objective['id']): Promise<Objective> {
    return this.repository.findOne({ id })
  }
}

export default ObjectiveService
