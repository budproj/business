import { Injectable } from '@nestjs/common'
import { Any } from 'typeorm'

import { CycleDTO } from 'src/domain/cycle/dto'
import { DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import DomainKeyResultService from 'src/domain/key-result/service'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { Objective } from './entities'
import DomainObjectiveRepository from './repository'

export interface DomainObjectiveServiceInterface {
  repository: DomainObjectiveRepository

  getFromOwner: (ownerId: UserDTO['id']) => Promise<Objective[]>
  getFromCycle: (cycleId: UserDTO['id']) => Promise<Objective[]>
  getFromTeam: (team: TeamDTO) => Promise<Objective[]>
}

@Injectable()
class DomainObjectiveService
  extends DomainEntityService<Objective, ObjectiveDTO>
  implements DomainObjectiveServiceInterface {
  constructor(
    public readonly repository: DomainObjectiveRepository,
    private readonly keyResultService: DomainKeyResultService,
  ) {
    super(repository, DomainObjectiveService.name)
  }

  public async getFromOwner(ownerId: UserDTO['id']) {
    return this.repository.find({ ownerId })
  }

  public async getFromCycle(cycleId: CycleDTO['id']) {
    return this.repository.find({ cycleId })
  }

  async getFromTeam(team: TeamDTO) {
    const keyResults = await this.keyResultService.getFromTeam(team.id, ['objectiveId'])
    if (!keyResults) return []

    const objectiveIds = keyResults.map((keyResult) => keyResult.objectiveId)
    if (objectiveIds.length === 0) return []

    const objectives = await this.repository.find({ where: { id: Any(objectiveIds) } })

    return objectives
  }
  //
  // async getCurrentProgress(objectiveID: ObjectiveDTO['id']) {
  //   const date = new Date()
  //   const currentProgress = await this.getProgressAtDate(date, objectiveID)
  //
  //   return currentProgress
  // }
  //
  // async getLastWeekProgress(objectiveID: ObjectiveDTO['id']) {
  //   const date = new Date()
  //   const startOfWeekDate = startOfWeek(date)
  //   const currentProgress = await this.getProgressAtDate(startOfWeekDate, objectiveID)
  //
  //   return currentProgress
  // }
  //
  // async getProgressAtDate(date: Date, objectiveId: ObjectiveDTO['id']) {
  //   const keyResults = await this.keyResultService.getFromObjective(objectiveId)
  //   if (!keyResults) return
  //
  //   const previousSnapshotDate = this.keyResultService.report.progress.snapshotDate
  //   this.keyResultService.report.progress.snapshotDate = date
  //
  //   const objectiveCurrentProgress = this.keyResultService.calculateSnapshotAverageProgressFromList(
  //     keyResults,
  //   )
  //
  //   this.keyResultService.report.progress.snapshotDate = previousSnapshotDate
  //
  //   return objectiveCurrentProgress
  // }
  //
  // async getCurrentConfidence(objectiveId: ObjectiveDTO['id']): Promise<ProgressReport['valueNew']> {
  //   const keyResults = await this.keyResultService.getFromObjective(objectiveId)
  //   if (!keyResults) return
  //
  //   const objectiveCurrentConfidence = this.keyResultService.getLowestConfidenceFromList(keyResults)
  //
  //   return objectiveCurrentConfidence
  // }
  //
  //
  // async getPercentageProgressIncrease(objectiveID: ObjectiveDTO['id']) {
  //   const currentProgress = await this.getCurrentProgress(objectiveID)
  //   const lastWeekProgress = await this.getLastWeekProgress(objectiveID)
  //
  //   const deltaProgress = currentProgress - lastWeekProgress
  //
  //   return deltaProgress
  // }

  protected async createIfUserIsInCompany(
    _data: Partial<Objective>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  protected async createIfUserIsInTeam(
    _data: Partial<Objective>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  protected async createIfUserOwnsIt(_data: Partial<Objective>, _queryContext: DomainQueryContext) {
    return {} as any
  }
}

export default DomainObjectiveService
