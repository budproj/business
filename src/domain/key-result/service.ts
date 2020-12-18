import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { sum } from 'lodash'

import { KeyResultDTO } from 'domain/key-result/dto'
import { ConfidenceReport } from 'domain/key-result/report/confidence/entities'
import { ProgressReport } from 'domain/key-result/report/progress/entities'
import { ObjectiveDTO } from 'domain/objective/dto'
import DomainEntityService from 'domain/service'
import { TeamDTO } from 'domain/team/dto'
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
  ) {
    super(repository, DomainKeyResultService.name)
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

  async getCurrentProgress(id: KeyResultDTO['id']): Promise<ProgressReport['valueNew']> {
    const defaultProgress = 0

    const { goal } = await this.repository.findOne({ id })
    const latestProgressReport = await this.report.progress.getLatestFromKeyResult(id)
    if (!latestProgressReport) return defaultProgress

    const currentProgress = (latestProgressReport.valueNew / goal) * 100

    return currentProgress
  }

  async getCurrentConfidence(id: KeyResultDTO['id']): Promise<ConfidenceReport['valueNew']> {
    const defaultConfidence = 51

    const { goal } = await this.repository.findOne({ id })
    const latestConfidenceReport = await this.report.confidence.getLatestFromKeyResult(id)
    if (!latestConfidenceReport) return defaultConfidence

    const currentConfidence = (latestConfidenceReport.valueNew / goal) * 100

    return currentConfidence
  }

  async calculateCurrentProgressFromList(keyResults: KeyResult[]) {
    const currentProgressList = await Promise.all(
      keyResults.map(async ({ id }) => this.getCurrentProgress(id)),
    )
    const calculatedCurrentProgress = sum(currentProgressList) / currentProgressList.length

    return calculatedCurrentProgress
  }

  async calculateCurrentConfidenceFromList(keyResults: KeyResult[]) {
    const currentConfidenceList = await Promise.all(
      keyResults.map(async ({ id }) => this.getCurrentConfidence(id)),
    )
    const calculatedCurrentConfidence = sum(currentConfidenceList) / currentConfidenceList.length

    return calculatedCurrentConfidence
  }
}

export default DomainKeyResultService
