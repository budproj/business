import { Injectable } from '@nestjs/common'

import { User } from 'domain/user-aggregate/user/entities'

import KeyResultService, { KeyResultLatestReport } from './key-result/service'

@Injectable()
class ObjectiveAggregateService {
  constructor(private readonly keyResultService: KeyResultService) {}

  async getKeyResultsOwnedBy(uid: User['id']): Promise<KeyResultLatestReport[]> {
    const keyResults = await this.keyResultService.getUserKeyResults(uid)
    const latestReportKeyResults = keyResults.map(
      this.keyResultService.filterKeyResultToLatestReport,
    )

    return latestReportKeyResults
  }
}

export default ObjectiveAggregateService
