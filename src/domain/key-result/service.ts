import { Injectable } from '@nestjs/common'

import { KeyResult } from './entities'
import KeyResultRepository from './repository'

@Injectable()
class KeyResultService {
  constructor(private readonly repository: KeyResultRepository) {}

  async getOneById(id: KeyResult['id']): Promise<KeyResult> {
    return this.repository.findOne({ where: { id } })
  }

  async getManyWithIDS(ids: Array<KeyResult['id']>): Promise<KeyResult[]> {
    return this.repository.findByIds(ids)
  }
}

export default KeyResultService
