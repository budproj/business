import { Injectable, Logger } from '@nestjs/common'
import { omit } from 'lodash'

import {
  IKeyResultView,
  IKeyResultViewBinding,
} from 'domain/objective-aggregate/key-result-view/dto'
import ObjectiveAggregateService, {
  KeyResultWithLatestReports,
} from 'domain/objective-aggregate/service'
import { User } from 'domain/user-aggregate/user/entities'

@Injectable()
class KeyResultsService {
  private readonly logger = new Logger(KeyResultsService.name)

  constructor(private readonly objectiveAggregateService: ObjectiveAggregateService) {}

  async getUserKeyResults(
    user: User,
    customRank: IKeyResultView['rank'] = [],
  ): Promise<Array<Partial<KeyResultWithLatestReports>>> {
    const dataWithRelations = await this.objectiveAggregateService.getRankedKeyResultsOwnedBy(
      user,
      customRank,
    )
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

  async getUserKeyResultsFromView(
    user: User,
    view: IKeyResultViewBinding | null,
  ): Promise<Array<Partial<KeyResultWithLatestReports>>> {
    this.logger.debug(`Getting Key Results for user ${user.id} and view binding named "${view}"`)

    const viewCustomRank = await this.objectiveAggregateService.getUserViewCustomRank(user, view)
    this.logger.debug({
      viewCustomRank,
      message: `Received user ${user.id} custom view "${view}" rank`,
    })

    const keyResults = await this.getUserKeyResults(user, viewCustomRank)
    this.logger.debug({
      keyResults,
      message: `Received key results for user ${user.id} using view "${view}"`,
    })

    return keyResults
  }
}

export default KeyResultsService
