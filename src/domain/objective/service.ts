import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { maxBy, minBy } from 'lodash'
import { Any } from 'typeorm'

import { CycleDTO } from 'src/domain/cycle/dto'
import { DomainCreationQuery, DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import { KeyResult } from 'src/domain/key-result/entities'
import DomainKeyResultService, { DomainKeyResultCheckInGroup } from 'src/domain/key-result/service'
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
  getCheckInGroupAtDate: (
    date: Date,
    objective: Objective,
  ) => Promise<DomainObjectiveCheckInGroup | undefined>
}

export interface DomainObjectiveCheckInGroup extends DomainKeyResultCheckInGroup {
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
    const currentCheckInGroup = await this.getCheckInGroupAtDate(date, objective)

    return currentCheckInGroup?.progress ?? DEFAULT_PROGRESS
  }

  public async getCurrentConfidenceForObjective(objective: ObjectiveDTO) {
    const date = new Date()
    const currentCheckInGroup = await this.getCheckInGroupAtDate(date, objective)

    return currentCheckInGroup?.confidence ?? DEFAULT_PROGRESS
  }

  public async getObjectiveProgressIncreaseSinceLastWeek(objective: ObjectiveDTO) {
    const progress = await this.getCurrentProgressForObjective(objective)
    const lastWeekProgress = await this.getLastWeekProgressForObjective(objective)

    const deltaProgress = progress - lastWeekProgress

    return deltaProgress
  }

  public async getCheckInGroupAtDate(
    date: Date,
    objective: ObjectiveDTO,
  ): Promise<DomainObjectiveCheckInGroup | undefined> {
    const keyResults = await this.keyResultService.getFromObjective(objective)
    if (!keyResults) return

    const objectiveCheckInGroup = await this.buildCheckInGroupAtDate(date, keyResults)

    return objectiveCheckInGroup
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

    const lastWeekCheckInGroup = await this.getCheckInGroupAtDate(firstDayAfterLastWeek, objective)

    return lastWeekCheckInGroup?.progress ?? DEFAULT_PROGRESS
  }

  private async buildCheckInGroupAtDate(date: Date, keyResults: KeyResult[]) {
    const keyResultCheckInGroupPromises = keyResults.map(async (keyResult) =>
      this.keyResultService.getLatestCheckInForKeyResultAtDate(keyResult, date),
    )
    const keyResultCheckInGroups = await Promise.all(keyResultCheckInGroupPromises)
    const latestKeyResultCheckIn = maxBy(keyResultCheckInGroups, 'createdAt')
    if (!latestKeyResultCheckIn) return this.buildDefaultCheckInGroup(date)

    const progress = this.keyResultService.calculateKeyResultCheckInListAverageProgress(
      keyResultCheckInGroups,
      keyResults,
    )
    const objectiveCheckInGroup: DomainObjectiveCheckInGroup = {
      latestKeyResultCheckIn,
      progress,
      confidence: minBy(keyResultCheckInGroups, 'confidence').confidence,
      createdAt: latestKeyResultCheckIn.createdAt,
    }

    return objectiveCheckInGroup
  }

  private buildDefaultCheckInGroup(
    date?: DomainObjectiveCheckInGroup['createdAt'],
    progress: DomainObjectiveCheckInGroup['progress'] = DEFAULT_PROGRESS,
    confidence: DomainObjectiveCheckInGroup['confidence'] = DEFAULT_CONFIDENCE,
  ) {
    date ??= new Date()

    const defaultCheckInGroup: DomainObjectiveCheckInGroup = {
      progress,
      confidence,
      createdAt: date,
    }

    return defaultCheckInGroup
  }
}

export default DomainObjectiveService
