import { Injectable, Logger } from '@nestjs/common'

import { User } from 'domain/user-aggregate/user/entities'

import { IConfidenceReport } from './confidence-report/dto'
import ConfidenceReportService from './confidence-report/service'
import { IKeyResultView, IKeyResultViewBinding } from './key-result-view/dto'
import KeyResultViewService from './key-result-view/service'
import { KeyResult } from './key-result/entities'
import KeyResultService, { KeyResultWithCycle } from './key-result/service'
import ObjectiveService from './objective/service'
import { IProgressReport } from './progress-report/dto'
import ProgressReportService from './progress-report/service'

export interface KeyResultWithLatestReports extends KeyResult {
  latestProgressReport: IProgressReport | Record<string, unknown>
  latestConfidenceReport: IConfidenceReport | Record<string, unknown>
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
    customRank: IKeyResultView['rank'],
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

  async getUserViewCustomRank(
    user: User,
    view: IKeyResultViewBinding | null,
  ): Promise<IKeyResultView['rank']> {
    if (!view) return []

    const userID = user.id
    const userCustomRank = await this.keyResultViewService.getUserViewCustomRank(userID, view)

    return userCustomRank
  }
}

export default ObjectiveAggregateService
