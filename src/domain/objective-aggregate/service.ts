import { Injectable, Logger } from '@nestjs/common'

import { KeyResultView } from 'domain/objective-aggregate/key-result-view/entities'
import { User } from 'domain/user-aggregate/user/entities'

import { ConfidenceReportDTO } from './confidence-report/dto'
import ConfidenceReportService from './confidence-report/service'
import { KeyResultViewDTO, KeyResultViewBinding } from './key-result-view/dto'
import KeyResultViewService from './key-result-view/service'
import { KeyResult } from './key-result/entities'
import KeyResultService, { KeyResultWithCycle } from './key-result/service'
import ObjectiveService from './objective/service'
import { ProgressReportDTO } from './progress-report/dto'
import ProgressReportService from './progress-report/service'

export interface KeyResultWithLatestReports extends KeyResult {
  latestProgressReport: ProgressReportDTO | Record<string, unknown>
  latestConfidenceReport: ConfidenceReportDTO | Record<string, unknown>
}

@Injectable()
class ObjectiveAggregateService {
  private readonly logger = new Logger(ObjectiveAggregateService.name)

  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly objectiveService: ObjectiveService,
    private readonly confidenceReportService: ConfidenceReportService,
    private readonly progressReportService: ProgressReportService,
    private readonly keyResultViewService: KeyResultViewService,
  ) {}

  async getRankedKeyResultsOwnedBy(
    user: User,
    customRank: KeyResultViewDTO['rank'],
  ): Promise<KeyResultWithCycle[]> {
    const ownerID = user.id
    const keyResults = await this.keyResultService.getRankedFromOwnerWithRelations(
      ownerID,
      customRank,
    )

    this.logger.debug({
      keyResults,
      user,
      message: `Selected all key results owned by user`,
    })

    const keyResultsWithObjectiveCycle = Promise.all(
      keyResults.map(async (keyResult) => ({
        ...keyResult,
        cycle: await this.objectiveService.getCycle(keyResult.objective),
      })),
    )

    this.logger.debug({
      keyResultsWithObjectiveCycle,
      user,
      message: `Enhanced selected key results with cycle`,
    })

    return keyResultsWithObjectiveCycle
  }

  getLatestReportsForKeyResult(keyResult: KeyResult): KeyResultWithLatestReports {
    return {
      ...keyResult,
      latestProgressReport: this.progressReportService.filterLatestFromList(
        keyResult.progressReports,
      ),
      latestConfidenceReport: this.confidenceReportService.filterLatestFromList(
        keyResult.confidenceReports,
      ),
    }
  }

  async getUserViewWithBinding(
    user: User,
    viewBinding: KeyResultViewBinding | null,
  ): Promise<KeyResultViewDTO | null> {
    if (!viewBinding) return

    const userID = user.id
    const userView = await this.keyResultViewService.getUserViewWithBinding(userID, viewBinding)

    return userView
  }

  async getUserViews(userID: User['id']): Promise<KeyResultView[]> {
    const views = await this.keyResultViewService.getUserViews(userID)

    return views
  }
}

export default ObjectiveAggregateService
