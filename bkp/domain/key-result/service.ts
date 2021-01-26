import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { sum, min, uniq, uniqBy, remove } from 'lodash'
import { FindConditions } from 'typeorm'

import { CONSTRAINT, TIMEFRAME_SCOPE } from 'src/domain/constants'
import { DEFAULT_CONFIDENCE, DEFAULT_PROGRESS } from 'src/domain/key-result/constants'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { ConfidenceReport } from 'src/domain/key-result/report/confidence/entities'
import { ProgressReport } from 'src/domain/key-result/report/progress/entities'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import DomainEntityService from 'src/domain/service'
import { TeamDTO } from 'src/domain/team/dto'
import DomainTeamService from 'src/domain/team/service'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResult } from './entities'
import DomainKeyResultReportService from './report/service'
import DomainKeyResultRepository from './repository'

@Injectable()
class DomainKeyResultService extends DomainEntityService<KeyResult, KeyResultDTO> {
  constructor(
    @Inject(forwardRef(() => DomainKeyResultReportService))
    public readonly report: DomainKeyResultReportService,
    public readonly repository: DomainKeyResultRepository,
    @Inject(forwardRef(() => DomainTeamService))
    private readonly teamService: DomainTeamService,
  ) {
    super(repository, DomainKeyResultService.name)
  }

  async parseUserCompanyIDs(user: UserDTO) {
    const userCompanies = await this.teamService.getUserCompanies(user)
    const userCompanyIDs = uniq(userCompanies.map((company) => company.id))

    return userCompanyIDs
  }

  async parseUserCompaniesTeamIDs(companyIDs: Array<TeamDTO['id']>) {
    const companiesTeams = await this.teamService.getAllTeamsBelowNodes(companyIDs)
    const companiesTeamIDs = uniq(companiesTeams.map((team) => team.id))

    return companiesTeamIDs
  }

  async getFromOwner(ownerId: UserDTO['id']): Promise<KeyResult[]> {
    return this.repository.find({ ownerId })
  }

  async getFromObjective(objectiveId: ObjectiveDTO['id']): Promise<KeyResult[]> {
    return this.repository.find({ objectiveId })
  }

  async getFromTeam(
    teamIds: TeamDTO['id'] | Array<TeamDTO['id']>,
    filter?: Array<keyof KeyResult>,
  ): Promise<KeyResult[]> {
    const isEmptyArray = Array.isArray(teamIds) ? teamIds.length === 0 : false
    if (!teamIds || isEmptyArray) return

    const buildSelector = (teamId: TeamDTO['id']) => ({ teamId })
    const selector = Array.isArray(teamIds)
      ? teamIds.map((teamID) => buildSelector(teamID))
      : buildSelector(teamIds)

    return this.repository.find({ where: selector, select: filter })
  }

  async getManyByIdsPreservingOrder(ids: Array<KeyResultDTO['id']>): Promise<KeyResult[]> {
    const rankSortColumn = this.repository.buildRankSortColumn(ids)
    const data = this.repository.findByIdsRanked(ids, rankSortColumn)

    return data
  }

  async getProgressInPercentage(
    id: KeyResultDTO['id'],
    timeframeScope: TIMEFRAME_SCOPE,
  ): Promise<ProgressReport['valueNew']> {
    const progressTimeframedSelectors = {
      [TIMEFRAME_SCOPE.CURRENT]: async () => this.getCurrentProgress(id),
      [TIMEFRAME_SCOPE.SNAPSHOT]: async () => this.getSnapshotProgress(id),
    }

    const timeframeSelector = progressTimeframedSelectors[timeframeScope]
    const currentProgress = await timeframeSelector()
    if (!currentProgress) return DEFAULT_PROGRESS

    const { goal, initialValue } = await this.repository.findOne({ id })
    const currentProgressInPercentage =
      ((currentProgress - initialValue) * 100) / (goal - initialValue)

    return currentProgressInPercentage
  }

  async getSnapshotProgress(id: KeyResultDTO['id']): Promise<ProgressReport['valueNew']> {
    const latestProgressReport = await this.report.progress.getLatestFromSnapshotForKeyResult(id)
    if (!latestProgressReport) return DEFAULT_PROGRESS

    return latestProgressReport.valueNew
  }

  async getCurrentProgress(id: KeyResultDTO['id']): Promise<ProgressReport['valueNew']> {
    const latestProgressReport = await this.report.progress.getLatestFromKeyResult(id)
    if (!latestProgressReport) return DEFAULT_PROGRESS

    return latestProgressReport.valueNew
  }

  async getCurrentConfidence(id: KeyResultDTO['id']): Promise<ConfidenceReport['valueNew']> {
    const latestConfidenceReport = await this.report.confidence.getLatestFromKeyResult(id)
    if (!latestConfidenceReport) return DEFAULT_CONFIDENCE

    return latestConfidenceReport.valueNew
  }

  async calculateAverageProgressFromList(
    keyResults: KeyResult[],
    timeframeScope: TIMEFRAME_SCOPE = TIMEFRAME_SCOPE.CURRENT,
  ) {
    const currentProgressList = await Promise.all(
      keyResults.map(async ({ id }) => this.getProgressInPercentage(id, timeframeScope)),
    )
    const currentProgress = sum(currentProgressList) / currentProgressList.length

    const normalizedCurrentProgress = Number.isNaN(currentProgress) ? 0 : currentProgress

    return normalizedCurrentProgress
  }

  async calculateCurrentAverageProgressFromList(keyResults: KeyResult[]) {
    const calculatedCurrentProgress = this.calculateAverageProgressFromList(keyResults)

    return calculatedCurrentProgress
  }

  async calculateSnapshotAverageProgressFromList(keyResults: KeyResult[]) {
    const calculatedSnapshotProgress = this.calculateAverageProgressFromList(
      keyResults,
      TIMEFRAME_SCOPE.SNAPSHOT,
    )

    return calculatedSnapshotProgress
  }

  async getLowestConfidenceFromList(keyResults: KeyResult[]) {
    const DEFAULT_CONFIDENCE = 100
    const currentConfidenceList = await Promise.all(
      keyResults.map(async ({ id }) => this.getCurrentConfidence(id)),
    )
    const minConfidence = min(currentConfidenceList)

    return minConfidence ?? DEFAULT_CONFIDENCE
  }

  async getReports(keyResultID: KeyResult['id']) {
    const progressReports = await this.report.progress.getFromKeyResult(keyResultID)
    const confidenceReports = await this.report.confidence.getFromKeyResult(keyResultID)

    const mergedReports = [...progressReports, ...confidenceReports]
    const uniqueReports = uniqBy(mergedReports, 'comment')

    return uniqueReports
  }

  async getOneReportWithConstraint(
    constraint: CONSTRAINT,
    selector: FindConditions<ProgressReport>,
    user: UserDTO,
  ) {
    const progressReport = await this.report.progress.getOneWithConstraint(
      constraint,
      selector,
      user,
    )
    const confidenceReport = await this.report.confidence.getOneWithConstraint(
      constraint,
      selector,
      user,
    )

    const report = remove([progressReport, confidenceReport])[0]

    return report
  }

  async getInitialValue(keyResultID: KeyResult['id']) {
    const keyResult = await this.repository.findOne(
      { id: keyResultID },
      { select: ['initialValue'] },
    )

    return keyResult.initialValue
  }
}

export default DomainKeyResultService
