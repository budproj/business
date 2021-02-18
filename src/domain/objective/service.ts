import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { maxBy, minBy } from 'lodash'
import { Any } from 'typeorm'

import { CycleDTO } from 'src/domain/cycle/dto'
import { DomainCreationQuery, DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import { KeyResult } from 'src/domain/key-result/entities'
import DomainKeyResultService, { DomainKeyResultStatus } from 'src/domain/key-result/service'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { DEFAULT_PROGRESS, DEFAULT_CONFIDENCE } from './constants'
import { Objective } from './entities'
import DomainObjectiveRepository from './repository'
import { ObjectiveFilters } from './types'

export interface DomainObjectiveServiceInterface {
  getFromOwner: (owner: UserDTO) => Promise<Objective[]>
  getFromCycle: (cycle: CycleDTO) => Promise<Objective[]>
  getFromTeams: (teams: TeamDTO | TeamDTO[], filters?: ObjectiveFilters) => Promise<Objective[]>
  getCurrentProgressForObjective: (objective: ObjectiveDTO) => Promise<KeyResultCheckIn['progress']>
  getCurrentConfidenceForObjective: (
    objective: ObjectiveDTO,
  ) => Promise<KeyResultCheckIn['confidence']>
  getObjectiveProgressIncreaseSinceLastWeek: (
    objective: ObjectiveDTO,
  ) => Promise<KeyResultCheckIn['progress']>
  getStatusAtDate: (date: Date, objective: Objective) => Promise<DomainObjectiveStatus | undefined>
  getCurrentStatus: (objective: ObjectiveDTO) => Promise<DomainObjectiveStatus>
}

export interface DomainObjectiveStatus extends DomainKeyResultStatus {
  latestKeyResultCheckIn?: KeyResultCheckInDTO
}

@Injectable()
class DomainObjectiveService
  extends DomainEntityService<Objective, ObjectiveDTO>
  implements DomainObjectiveServiceInterface {
  constructor(
    protected readonly repository: DomainObjectiveRepository,
    @Inject(forwardRef(() => DomainKeyResultService))
    private readonly keyResultService: DomainKeyResultService,
  ) {
    super(DomainObjectiveService.name, repository)
  }

  public async getFromOwner(owner: UserDTO) {
    return this.repository.find({ ownerId: owner.id })
  }

  public async getFromCycle(cycle: CycleDTO) {
    return this.repository.find({ cycleId: cycle.id })
  }

  public async getFromTeams(team: TeamDTO | TeamDTO[], filters?: ObjectiveFilters) {
    const keyResults = await this.keyResultService.getFromTeams(team, filters)
    if (!keyResults) return []

    const objectiveIds = keyResults.map((keyResult) => keyResult.objectiveId)
    if (objectiveIds.length === 0) return []

    const objectives = await this.repository.find({ where: { id: Any(objectiveIds) } })

    return objectives
  }

  public async getCurrentProgressForObjective(objective: ObjectiveDTO) {
    const date = new Date()
    const currentStatus = await this.getStatusAtDate(date, objective)

    return currentStatus?.progress ?? DEFAULT_PROGRESS
  }

  public async getCurrentConfidenceForObjective(objective: ObjectiveDTO) {
    const date = new Date()
    const currentStatus = await this.getStatusAtDate(date, objective)

    return currentStatus?.confidence ?? DEFAULT_PROGRESS
  }

  public async getObjectiveProgressIncreaseSinceLastWeek(objective: ObjectiveDTO) {
    const progress = await this.getCurrentProgressForObjective(objective)
    const lastWeekProgress = await this.getLastWeekProgressForObjective(objective)

    const deltaProgress = progress - lastWeekProgress

    return deltaProgress
  }

  public async getStatusAtDate(
    date: Date,
    objective: ObjectiveDTO,
  ): Promise<DomainObjectiveStatus | undefined> {
    const keyResults = await this.keyResultService.getFromObjective(objective)
    if (!keyResults) return

    const objectiveStatus = await this.buildStatusAtDate(date, keyResults)

    return objectiveStatus
  }

  public async getCurrentStatus(objective: ObjectiveDTO) {
    const date = new Date()
    const objectiveStatus = await this.getStatusAtDate(date, objective)

    return objectiveStatus
  }

  protected async protectCreationQuery(
    _query: DomainCreationQuery<Objective>,
    _data: Partial<ObjectiveDTO>,
    _queryContext: DomainQueryContext,
  ) {
    return []
  }

  private async getLastWeekProgressForObjective(objective: ObjectiveDTO) {
    const firstDayAfterLastWeek = this.getFirstDayAfterLastWeek()

    const lastWeekStatus = await this.getStatusAtDate(firstDayAfterLastWeek, objective)

    return lastWeekStatus?.progress ?? DEFAULT_PROGRESS
  }

  private async buildStatusAtDate(date: Date, keyResults: KeyResult[]) {
    const keyResultStatusPromises = keyResults.map(async (keyResult) =>
      this.keyResultService.getLatestCheckInForKeyResultAtDate(keyResult, date),
    )
    const keyResultStatuss = await Promise.all(keyResultStatusPromises)
    const latestKeyResultCheckIn = maxBy(keyResultStatuss, 'createdAt')
    if (!latestKeyResultCheckIn) return this.buildDefaultStatus(date)

    const progress = this.keyResultService.calculateKeyResultCheckInListAverageProgress(
      keyResultStatuss,
      keyResults,
    )
    const objectiveStatus: DomainObjectiveStatus = {
      latestKeyResultCheckIn,
      progress,
      confidence: minBy(keyResultStatuss, 'confidence').confidence,
      createdAt: latestKeyResultCheckIn.createdAt,
    }

    return objectiveStatus
  }

  private buildDefaultStatus(
    date?: DomainObjectiveStatus['createdAt'],
    progress: DomainObjectiveStatus['progress'] = DEFAULT_PROGRESS,
    confidence: DomainObjectiveStatus['confidence'] = DEFAULT_CONFIDENCE,
  ) {
    date ??= new Date()

    const defaultStatus: DomainObjectiveStatus = {
      progress,
      confidence,
      createdAt: date,
    }

    return defaultStatus
  }
}

export default DomainObjectiveService
