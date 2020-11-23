import { Injectable, Logger } from '@nestjs/common'

import { KeyResultView } from 'domain/objective-aggregate/key-result-view/entities'
import { KeyResultDTO } from 'domain/objective-aggregate/key-result/dto'
import { ProgressReport } from 'domain/objective-aggregate/progress-report/entities'
import { UserDTO } from 'domain/user-aggregate/user/dto'
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

  enhanceKeyResultWithLatestReports(keyResult: KeyResult): KeyResultWithLatestReports {
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

  async createKeyResultView(keyResultView: Partial<KeyResultViewDTO>): Promise<KeyResultView> {
    const createdData = await this.keyResultViewService.create(keyResultView)

    return createdData
  }

  async isViewFromUser(
    keyResultViewID: KeyResultViewDTO['id'],
    userID: UserDTO['id'],
  ): Promise<boolean> {
    this.logger.debug(
      `Trying to validate if user ${userID.toString()} is owner of Key Result View ${keyResultViewID.toString()}`,
    )

    const keyResultViewOwnerID = await this.keyResultViewService.getUserID(keyResultViewID)
    this.logger.debug(
      `Discovered that key result view ${keyResultViewID} is owned by user ${keyResultViewOwnerID}`,
    )

    return keyResultViewOwnerID === userID
  }

  async updateKeyResultView(
    keyResultViewID: KeyResultViewDTO['id'],
    newKeyResultView: Partial<KeyResultView>,
  ): Promise<KeyResultView> {
    const data = {
      id: keyResultViewID,
      ...newKeyResultView,
    }
    const updatedKeyResultView = await this.keyResultViewService.update(data)

    this.logger.debug({
      data,
      updatedKeyResultView,
      message: `Updated key result view of ID ${keyResultViewID.toString()}`,
    })

    return updatedKeyResultView
  }

  async getLatestProgressReport(keyResultID: KeyResultDTO['id']): Promise<ProgressReport> {
    const latestProgressReport = await this.progressReportService.getLatest(keyResultID)

    return latestProgressReport
  }

  async getKeyResultOwner(keyResultID: KeyResultDTO['id']): Promise<KeyResult['owner']> {
    const keyResult = await this.keyResultService.getWithID(keyResultID)

    return keyResult.owner
  }
}

export default ObjectiveAggregateService
