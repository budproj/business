import { Injectable } from '@nestjs/common'
import { startOfWeek } from 'date-fns'
import { Any } from 'typeorm'

import { CycleDTO } from 'domain/cycle/dto'
import { ProgressReport } from 'domain/key-result/report/progress/entities'
import DomainKeyResultService from 'domain/key-result/service'
import { ObjectiveDTO } from 'domain/objective/dto'
import DomainEntityService from 'domain/service'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { Objective } from './entities'
import DomainObjectiveRepository from './repository'

@Injectable()
class DomainObjectiveService extends DomainEntityService<Objective, ObjectiveDTO> {
  constructor(
    public readonly repository: DomainObjectiveRepository,
    private readonly keyResultService: DomainKeyResultService,
  ) {
    super(repository, DomainObjectiveService.name)
  }

  async getFromCycle(cycleId: CycleDTO['id']): Promise<Objective[]> {
    return this.repository.find({ cycleId })
  }

  async getFromOwner(ownerId: UserDTO['id']): Promise<Objective[]> {
    return this.repository.find({ ownerId })
  }

  async getCurrentProgress(objectiveID: ObjectiveDTO['id']) {
    const date = new Date()
    const currentProgress = await this.getProgressAtDate(date, objectiveID)

    return currentProgress
  }

  async getLastWeekProgress(objectiveID: ObjectiveDTO['id']) {
    const date = new Date()
    const startOfWeekDate = startOfWeek(date)
    const currentProgress = await this.getProgressAtDate(startOfWeekDate, objectiveID)

    return currentProgress
  }

  async getProgressAtDate(date: Date, objectiveId: ObjectiveDTO['id']) {
    const keyResults = await this.keyResultService.getFromObjective(objectiveId)
    if (!keyResults) return

    const previousSnapshotDate = this.keyResultService.report.progress.snapshotDate
    this.keyResultService.report.progress.snapshotDate = date

    const objectiveCurrentProgress = this.keyResultService.calculateSnapshotAverageProgressFromList(
      keyResults,
    )

    this.keyResultService.report.progress.snapshotDate = previousSnapshotDate

    return objectiveCurrentProgress
  }

  async getCurrentConfidence(objectiveId: ObjectiveDTO['id']): Promise<ProgressReport['valueNew']> {
    const keyResults = await this.keyResultService.getFromObjective(objectiveId)
    if (!keyResults) return

    const objectiveCurrentConfidence = this.keyResultService.calculateCurrentAverageConfidenceFromList(
      keyResults,
    )

    return objectiveCurrentConfidence
  }

  async getFromTeam(teamId: TeamDTO['id']) {
    const keyResults = await this.keyResultService.getFromTeam(teamId, ['objectiveId'])
    if (!keyResults) return []

    const objectiveIds = keyResults.map((keyResult) => keyResult.objectiveId)
    if (objectiveIds.length === 0) return []

    const objectives = await this.repository.find({ where: { id: Any(objectiveIds) } })

    return objectives
  }

  async getPercentageProgressIncrease(objectiveID: ObjectiveDTO['id']) {
    const currentProgress = await this.getCurrentProgress(objectiveID)
    const lastWeekProgress = await this.getLastWeekProgress(objectiveID)

    const deltaProgress = currentProgress - lastWeekProgress

    return deltaProgress
  }
}

export default DomainObjectiveService
