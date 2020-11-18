import { Injectable } from '@nestjs/common'

import { KeyResult } from './key-result/entities'
import KeyResultService from './key-result/service'

@Injectable()
class ObjectiveAggregateService {
  constructor(private readonly keyResultService: KeyResultService) {}

  async getKeyResultsOwnedBy(uid: number): Promise<KeyResult[]> {
    return this.keyResultService.findWhere({ owner: uid })
  }
}

export default ObjectiveAggregateService
