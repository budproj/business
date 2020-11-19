import { Injectable } from '@nestjs/common'

import { User } from 'domain/user-aggregate/user/entities'

import { KeyResult } from './key-result/entities'
import KeyResultService from './key-result/service'

@Injectable()
class ObjectiveAggregateService {
  constructor(private readonly keyResultService: KeyResultService) {}

  async getKeyResultsOwnedBy(uid: User['id']): Promise<KeyResult[]> {
    const keyResults = await this.keyResultService.getUserKeyResults(uid)

    return keyResults
  }
}

export default ObjectiveAggregateService
