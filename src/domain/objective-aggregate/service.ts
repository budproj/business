import { Injectable } from '@nestjs/common'

import KeyResultService from './key-result/service'

@Injectable()
class ObjectiveAggregateService {
  constructor(private readonly keyResultService: KeyResultService) {}

  getKeyResultsOwnedBy(uid: string): string {
    return 'test'
  }
}

export default ObjectiveAggregateService
