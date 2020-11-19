import { Injectable, Logger } from '@nestjs/common'
import { omit } from 'lodash'

import ObjectiveAggregateService, {
  KeyResultWithLatestReports,
} from 'domain/objective-aggregate/service'
import { User } from 'domain/user-aggregate/user/entities'

@Injectable()
class KeyResultsService {
  private readonly logger = new Logger(KeyResultsService.name)

  constructor(private readonly objectiveAggregateService: ObjectiveAggregateService) {}

  async getUserKeyResults(user: User): Promise<Array<Partial<KeyResultWithLatestReports>>> {
    const dataWithRelations = await this.objectiveAggregateService.getOwnedBy(user)
    this.logger.debug({
      dataWithRelations,
      message: `Selected key results owned by user ${user.id}`,
    })

    const dataOnlyWithLatestReports = dataWithRelations.map((keyResult) => {
      const keyResultWithLatestReports = this.objectiveAggregateService.getLatestReportsForKeyResult(
        keyResult,
      )
      const normalizedKeyResult = omit(keyResultWithLatestReports, [
        'progressReports',
        'confidenceReports',
      ])

      return normalizedKeyResult
    })
    this.logger.debug({
      dataWithRelations,
      dataOnlyWithLatestReports,
      message: `Reduced user ${user.id} key results confidence and progress reports to latest only`,
    })

    return dataOnlyWithLatestReports
  }
}

export default KeyResultsService
