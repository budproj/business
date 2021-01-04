import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { sum, uniq } from 'lodash'

import { TIMEFRAME_SCOPE } from 'domain/constants'
import { KeyResultDTO } from 'domain/key-result/dto'
import { ConfidenceReport } from 'domain/key-result/report/confidence/entities'
import { ProgressReport } from 'domain/key-result/report/progress/entities'
import { ObjectiveDTO } from 'domain/objective/dto'
import DomainEntityService from 'domain/service'
import { TeamDTO } from 'domain/team/dto'
import DomainTeamService from 'domain/team/service'
import { UserDTO } from 'domain/user/dto'

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
    const userCompanies = await this.teamService.getUserRootTeams(user)
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
    const selector = Array.isArray(teamIds) ? teamIds.map(buildSelector) : buildSelector(teamIds)

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
    const defaultProgress = 0
    const progressTimeframedSelectors = {
      [TIMEFRAME_SCOPE.CURRENT]: async () => this.getCurrentProgress(id),
      [TIMEFRAME_SCOPE.SNAPSHOT]: async () => this.getSnapshotProgress(id),
    }

    const timeframeSelector = progressTimeframedSelectors[timeframeScope]
    const currentProgress = await timeframeSelector()
    if (!currentProgress) return defaultProgress

    const { goal, initialValue } = await this.repository.findOne({ id })
    const currentProgressInPercentage =
      ((currentProgress - initialValue) * 100) / (goal - initialValue)

    return currentProgressInPercentage
  }

  async getSnapshotProgress(id: KeyResultDTO['id']): Promise<ProgressReport['valueNew']> {
    const defaultProgress = 0

    const latestProgressReport = await this.report.progress.getLatestFromSnapshotForKeyResult(id)
    if (!latestProgressReport) return defaultProgress

    return latestProgressReport.valueNew
  }

  async getCurrentProgress(id: KeyResultDTO['id']): Promise<ProgressReport['valueNew']> {
    const defaultProgress = 0

    const latestProgressReport = await this.report.progress.getLatestFromKeyResult(id)
    if (!latestProgressReport) return defaultProgress

    return latestProgressReport.valueNew
  }

  async getCurrentConfidence(id: KeyResultDTO['id']): Promise<ConfidenceReport['valueNew']> {
    const defaultConfidence = 51

    const latestConfidenceReport = await this.report.confidence.getLatestFromKeyResult(id)
    if (!latestConfidenceReport) return defaultConfidence

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

  async calculateAverageCurrentConfidenceFromList(keyResults: KeyResult[]) {
    const currentConfidenceList = await Promise.all(
      keyResults.map(async ({ id }) => this.getCurrentConfidence(id)),
    )
    const currentConfidence = sum(currentConfidenceList) / currentConfidenceList.length

    const normalizedCurrentConfidence = Number.isNaN(currentConfidence) ? 100 : currentConfidence

    return normalizedCurrentConfidence
  }
}

export default DomainKeyResultService
