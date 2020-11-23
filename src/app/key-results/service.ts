import { Injectable, Logger } from '@nestjs/common'
import { omit } from 'lodash'

import {
  KeyResultViewDTO,
  KeyResultViewBinding,
} from 'domain/objective-aggregate/key-result-view/dto'
import ObjectiveAggregateService, {
  KeyResultWithLatestReports,
} from 'domain/objective-aggregate/service'
import { User } from 'domain/user-aggregate/user/entities'

@Injectable()
class KeyResultsService {
  private readonly logger = new Logger(KeyResultsService.name)

  constructor(private readonly objectiveAggregateService: ObjectiveAggregateService) {}

  async getUserRankedKeyResults(
    user: User,
    customRank: KeyResultViewDTO['rank'] = [],
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
      const keyResultWithLatestReports = this.objectiveAggregateService.enhanceKeyResultWithLatestReports(
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

  async getUserBindedView(
    user: User,
    viewBinding: KeyResultViewBinding,
  ): Promise<KeyResultViewDTO | null> {
    this.logger.debug(`Getting user ${user.id} view for binding "${viewBinding}"`)

    const userView = await this.objectiveAggregateService.getUserViewWithBinding(user, viewBinding)
    this.logger.debug({
      userView,
      message: `Received user ${user.id} custom view "${viewBinding}"`,
    })

    return userView
  }

  async getUserKeyResultsFromView(
    user: User,
    view: KeyResultViewDTO | null,
  ): Promise<Array<Partial<KeyResultWithLatestReports>>> {
    this.logger.debug(`Getting Key Results for user ${user.id} and view named "${view?.binding}"`)
    const viewRank = view?.rank ?? []

    const keyResults = await this.getUserRankedKeyResults(user, viewRank)
    this.logger.debug({
      keyResults,
      message: `Received key results for user ${user.id} using view "${view?.binding}"`,
    })

    return keyResults
  }
}

export default KeyResultsService
