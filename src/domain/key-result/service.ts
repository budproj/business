import { Injectable } from '@nestjs/common'

import { ObjectiveDTO } from 'domain/objective/dto'
import { UserDTO } from 'domain/user/dto'

import { KeyResult } from './entities'
import KeyResultRepository from './repository'

@Injectable()
class KeyResultService {
  constructor(private readonly repository: KeyResultRepository) {}

  async getOneById(id: KeyResult['id']): Promise<KeyResult> {
    return this.repository.findOne({ where: { id } })
  }

  async getOwnedBy(ownerId: UserDTO['id']): Promise<KeyResult[]> {
    return this.repository.find({ ownerId })
  }

  async getFromObjective(objectiveId: ObjectiveDTO['id']): Promise<KeyResult[]> {
    return this.repository.find({ objectiveId })
  }
}

export default KeyResultService
