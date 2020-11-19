import { Injectable, Logger } from '@nestjs/common'

import { User } from 'domain/user-aggregate/user/entities'

import KeyResultService, { KeyResultsWithLatestReport } from './key-result/service'

@Injectable()
class ObjectiveAggregateService {
  private readonly logger = new Logger(ObjectiveAggregateService.name)

  constructor(private readonly keyResultService: KeyResultService) {}

  async getOwnedBy(user: User): Promise<KeyResultsWithLatestReport[]> {
    const ownerID = user.id
    const keyResults = await this.keyResultService.getFromOwnerWithRelationsAndLatestReports(
      ownerID,
    )

    this.logger.debug({
      keyResults,
      user,
      message: `Selected all key results owned by user`,
    })

    return keyResults
  }
}

export default ObjectiveAggregateService
