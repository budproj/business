import { Injectable } from '@nestjs/common'
import { Any } from 'typeorm'

import { CycleDTO } from 'src/domain/cycle/dto'
import { DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import DomainKeyResultService from 'src/domain/key-result/service'
import { DEFAULT_PROGRESS } from 'src/domain/objective/constants'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { Objective } from './entities'
import DomainObjectiveRepository from './repository'

export interface DomainObjectiveServiceInterface {
  repository: DomainObjectiveRepository

  getFromOwner: (owner: UserDTO) => Promise<Objective[]>
  getFromCycle: (cycle: CycleDTO) => Promise<Objective[]>
  getFromTeam: (team: TeamDTO) => Promise<Objective[]>
  getCurrentProgressForObjective: (
    objective: ObjectiveDTO,
  ) => Promise<KeyResultCheckInDTO['progress']>
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

  public async getFromOwner(owner: UserDTO) {
    return this.repository.find({ ownerId: owner.id })
  }

  public async getFromCycle(cycle: CycleDTO) {
    return this.repository.find({ cycleId: cycle.id })
  }

  public async getFromTeam(team: TeamDTO) {
    const keyResults = await this.keyResultService.getFromTeams(team, ['objectiveId'])
    if (!keyResults) return []

    const objectiveIds = keyResults.map((keyResult) => keyResult.objectiveId)
    if (objectiveIds.length === 0) return []

    const objectives = await this.repository.find({ where: { id: Any(objectiveIds) } })

    return objectives
  }

  public async getCurrentProgressForObjective(objective: ObjectiveDTO) {
    const date = new Date()
    const currentProgress = await this.getProgressAtDateForObjective(date, objective)

    return currentProgress
  }
  //
  // async getLastWeekProgress(objectiveID: ObjectiveDTO['id']) {
  //   const date = new Date()
  //   const startOfWeekDate = startOfWeek(date)
  //   const currentProgress = await this.getProgressAtDate(startOfWeekDate, objectiveID)
  //
  //   return currentProgress
  // }
  //
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

  private async getProgressAtDateForObjective(date: Date, objective: ObjectiveDTO) {
    const keyResults = await this.keyResultService.getFromObjective(objective)
    if (!keyResults) return DEFAULT_PROGRESS

    const previousSnapshotDate = this.keyResultService.snapshotDate
    this.keyResultService.snapshotDate = date

    const objectiveCurrentProgress = this.keyResultService.calculateSnapshotAverageProgressFromKeyResultList(
      keyResults,
    )

    this.keyResultService.snapshotDate = previousSnapshotDate

    return objectiveCurrentProgress
  }
}

export default DomainObjectiveService
