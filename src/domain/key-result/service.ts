import { Injectable } from '@nestjs/common'

import { DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import DomainKeyResultCustomListService from 'src/domain/key-result/custom-list/service'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResult } from './entities'
import DomainKeyResultRepository from './repository'

export interface DomainKeyResultServiceInterface {
  repository: DomainKeyResultRepository
  customList: DomainKeyResultCustomListService

  getFromOwner: (ownerId: UserDTO['id']) => Promise<KeyResult[]>
  getFromTeam: (teamIDs: TeamDTO['id'] | Array<TeamDTO['id']>) => Promise<KeyResult[]>
  getFromObjective: (objectiveId: ObjectiveDTO['id']) => Promise<KeyResult[]>
}

@Injectable()
class DomainKeyResultService
  extends DomainEntityService<KeyResult, KeyResultDTO>
  implements DomainKeyResultServiceInterface {
  constructor(
    public readonly repository: DomainKeyResultRepository,
    public readonly customList: DomainKeyResultCustomListService,
  ) {
    super(repository, DomainKeyResultService.name)
  }

  public async getFromOwner(ownerId: UserDTO['id']) {
    return this.repository.find({ ownerId })
  }

  public async getFromTeam(
    teamIDs: TeamDTO['id'] | Array<TeamDTO['id']>,
    filter?: Array<keyof KeyResult>,
  ): Promise<KeyResult[]> {
    const isEmptyArray = Array.isArray(teamIDs) ? teamIDs.length === 0 : false
    if (!teamIDs || isEmptyArray) return

    const buildSelector = (teamId: TeamDTO['id']) => ({ teamId })
    const selector = Array.isArray(teamIDs)
      ? teamIDs.map((teamID) => buildSelector(teamID))
      : buildSelector(teamIDs)

    return this.repository.find({ where: selector, select: filter })
  }

  public async getFromObjective(objectiveId: ObjectiveDTO['id']): Promise<KeyResult[]> {
    return this.repository.find({ objectiveId })
  }

  protected async createIfUserIsInCompany(
    _data: Partial<KeyResult>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  protected async createIfUserIsInTeam(
    _data: Partial<KeyResult>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  protected async createIfUserOwnsIt(_data: Partial<KeyResult>, _queryContext: DomainQueryContext) {
    return {} as any
  }
  //
  //
  // async getManyByIdsPreservingOrder(ids: Array<KeyResultDTO['id']>): Promise<KeyResult[]> {
  //   const rankSortColumn = this.repository.buildRankSortColumn(ids)
  //   const data = this.repository.findByIdsRanked(ids, rankSortColumn)
  //
  //   return data
  // }
  //
  // async getProgressInPercentage(
  //   id: KeyResultDTO['id'],
  //   timeframeScope: TIMEFRAME_SCOPE,
  // ): Promise<ProgressReport['valueNew']> {
  //   const progressTimeframedSelectors = {
  //     [TIMEFRAME_SCOPE.CURRENT]: async () => this.getCurrentProgress(id),
  //     [TIMEFRAME_SCOPE.SNAPSHOT]: async () => this.getSnapshotProgress(id),
  //   }
  //
  //   const timeframeSelector = progressTimeframedSelectors[timeframeScope]
  //   const currentProgress = await timeframeSelector()
  //   if (!currentProgress) return DEFAULT_PROGRESS
  //
  //   const { goal, initialValue } = await this.repository.findOne({ id })
  //   const currentProgressInPercentage =
  //     ((currentProgress - initialValue) * 100) / (goal - initialValue)
  //
  //   return currentProgressInPercentage
  // }
  //
  // async getSnapshotProgress(id: KeyResultDTO['id']): Promise<ProgressReport['valueNew']> {
  //   const latestProgressReport = await this.report.progress.getLatestFromSnapshotForKeyResult(id)
  //   if (!latestProgressReport) return DEFAULT_PROGRESS
  //
  //   return latestProgressReport.valueNew
  // }
  //
  // async getCurrentProgress(id: KeyResultDTO['id']): Promise<ProgressReport['valueNew']> {
  //   const latestProgressReport = await this.report.progress.getLatestFromKeyResult(id)
  //   if (!latestProgressReport) return DEFAULT_PROGRESS
  //
  //   return latestProgressReport.valueNew
  // }
  //
  // async getCurrentConfidence(id: KeyResultDTO['id']): Promise<ConfidenceReport['valueNew']> {
  //   const latestConfidenceReport = await this.report.confidence.getLatestFromKeyResult(id)
  //   if (!latestConfidenceReport) return DEFAULT_CONFIDENCE
  //
  //   return latestConfidenceReport.valueNew
  // }
  //
  // async calculateAverageProgressFromList(
  //   keyResults: KeyResult[],
  //   timeframeScope: TIMEFRAME_SCOPE = TIMEFRAME_SCOPE.CURRENT,
  // ) {
  //   const currentProgressList = await Promise.all(
  //     keyResults.map(async ({ id }) => this.getProgressInPercentage(id, timeframeScope)),
  //   )
  //   const currentProgress = sum(currentProgressList) / currentProgressList.length
  //
  //   const normalizedCurrentProgress = Number.isNaN(currentProgress) ? 0 : currentProgress
  //
  //   return normalizedCurrentProgress
  // }
  //
  // async calculateCurrentAverageProgressFromList(keyResults: KeyResult[]) {
  //   const calculatedCurrentProgress = this.calculateAverageProgressFromList(keyResults)
  //
  //   return calculatedCurrentProgress
  // }
  //
  // async calculateSnapshotAverageProgressFromList(keyResults: KeyResult[]) {
  //   const calculatedSnapshotProgress = this.calculateAverageProgressFromList(
  //     keyResults,
  //     TIMEFRAME_SCOPE.SNAPSHOT,
  //   )
  //
  //   return calculatedSnapshotProgress
  // }
  //
  // async getLowestConfidenceFromList(keyResults: KeyResult[]) {
  //   const DEFAULT_CONFIDENCE = 100
  //   const currentConfidenceList = await Promise.all(
  //     keyResults.map(async ({ id }) => this.getCurrentConfidence(id)),
  //   )
  //   const minConfidence = min(currentConfidenceList)
  //
  //   return minConfidence ?? DEFAULT_CONFIDENCE
  // }
  //
  // async getReports(keyResultID: KeyResult['id']) {
  //   const progressReports = await this.report.progress.getFromKeyResult(keyResultID)
  //   const confidenceReports = await this.report.confidence.getFromKeyResult(keyResultID)
  //
  //   const mergedReports = [...progressReports, ...confidenceReports]
  //   const uniqueReports = uniqBy(mergedReports, 'comment')
  //
  //   return uniqueReports
  // }
  //
  // async getOneReportWithConstraint(
  //   constraint: CONSTRAINT,
  //   selector: FindConditions<ProgressReport>,
  //   user: UserDTO,
  // ) {
  //   const progressReport = await this.report.progress.getOneWithConstraint(
  //     constraint,
  //     selector,
  //     user,
  //   )
  //   const confidenceReport = await this.report.confidence.getOneWithConstraint(
  //     constraint,
  //     selector,
  //     user,
  //   )
  //
  //   const report = remove([progressReport, confidenceReport])[0]
  //
  //   return report
  // }
  //
  // async getInitialValue(keyResultID: KeyResult['id']) {
  //   const keyResult = await this.repository.findOne(
  //     { id: keyResultID },
  //     { select: ['initialValue'] },
  //   )
  //
  //   return keyResult.initialValue
  // }
}

export default DomainKeyResultService
