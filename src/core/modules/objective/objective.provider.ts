import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { maxBy, minBy } from 'lodash'
import { Any, FindConditions } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleProvider } from '@core/modules/cycle/cycle.provider'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { KeyResultProvider } from '@core/modules/key-result/key-result.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CreationQuery } from '@core/types/creation-query.type'

import { ObjectiveStatus } from './interfaces/objective-status.interface'
import { ObjectiveInterface } from './interfaces/objective.interface'
import { DEFAULT_CONFIDENCE, DEFAULT_PROGRESS } from './objective.constants'
import { Objective } from './objective.orm-entity'
import { ObjectiveRepository } from './objective.repository'

@Injectable()
export class ObjectiveProvider extends CoreEntityProvider<Objective, ObjectiveInterface> {
  constructor(
    protected readonly repository: ObjectiveRepository,
    @Inject(forwardRef(() => CycleProvider))
    private readonly cycleProvider: CycleProvider,
    @Inject(forwardRef(() => KeyResultProvider))
    private readonly keyResultProvider: KeyResultProvider,
  ) {
    super(ObjectiveProvider.name, repository)
  }

  public async getFromOwner(
    user: UserInterface,
    filters?: FindConditions<Objective>,
    options?: GetOptions<Objective>,
  ): Promise<Objective[]> {
    const queryOptions = this.repository.marshalGetOptions(options)
    const whereSelector = {
      ...filters,
      ownerId: user.id,
    }

    return this.repository.find({
      ...queryOptions,
      where: whereSelector,
    })
  }

  public async getFromCycle(
    cycle: CycleInterface,
    filters?: FindConditions<Cycle>,
    options?: GetOptions<Cycle>,
  ): Promise<Objective[]> {
    const whereSelector = {
      ...filters,
      cycleId: cycle.id,
    }

    return this.repository.find({
      ...options,
      where: whereSelector,
    })
  }

  public async getFromKeyResult(keyResult: KeyResultInterface): Promise<Objective> {
    return this.repository.findOne({ id: keyResult.objectiveId })
  }

  public async isActiveFromIndexes(
    objectiveIndexes: Partial<ObjectiveInterface>,
  ): Promise<boolean> {
    const objective = await this.repository.findOne(objectiveIndexes)

    return this.cycleProvider.isActiveFromIndexes({ id: objective.cycleId })
  }

  public async getCurrentStatus(objective: ObjectiveInterface): Promise<ObjectiveStatus> {
    const date = new Date()
    const objectiveStatus = await this.getStatusAtDate(date, objective)

    return objectiveStatus
  }

  public async getStatusAtDate(
    date: Date,
    objective: ObjectiveInterface,
  ): Promise<ObjectiveStatus | undefined> {
    const keyResults = await this.keyResultProvider.getFromObjective(objective)
    if (!keyResults || keyResults.length === 0) return

    const objectiveStatus = await this.buildStatusAtDate(date, keyResults)

    return objectiveStatus
  }

  public async getFromTeams(
    team: TeamInterface | TeamInterface[],
    filters?: FindConditions<Objective>,
    options?: GetOptions<Objective>,
  ): Promise<Objective[]> {
    const keyResults = await this.keyResultProvider.getFromTeams(team)
    if (!keyResults) return []

    const objectiveIds = keyResults.map((keyResult) => keyResult.objectiveId)
    if (objectiveIds.length === 0) return []

    const whereSelector = {
      ...filters,
      id: Any(objectiveIds),
    }

    const objectives = await this.repository.find({
      ...options,
      where: whereSelector,
    })

    return objectives
  }

  public async getObjectiveProgressIncreaseSinceLastWeek(
    objective: ObjectiveInterface,
  ): Promise<number> {
    const progress = await this.getCurrentProgressForObjective(objective)
    const lastWeekProgress = await this.getLastWeekProgressForObjective(objective)

    const deltaProgress = progress - lastWeekProgress

    return deltaProgress
  }

  protected async protectCreationQuery(
    _query: CreationQuery<Objective>,
    _data: Partial<ObjectiveInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }

  private async buildStatusAtDate(date: Date, keyResults: KeyResult[]): Promise<ObjectiveStatus> {
    const keyResultStatusPromises = keyResults.map(async (keyResult) =>
      this.keyResultProvider.getLatestCheckInForKeyResultAtDate(keyResult, date),
    )
    const keyResultStatuss = await Promise.all(keyResultStatusPromises)
    const latestKeyResultCheckIn = maxBy(keyResultStatuss, 'createdAt')
    if (!latestKeyResultCheckIn) return this.buildDefaultStatus(date)

    const progress = this.keyResultProvider.calculateKeyResultCheckInListAverageProgress(
      keyResultStatuss,
      keyResults,
    )
    const objectiveStatus = {
      latestKeyResultCheckIn,
      progress,
      confidence: minBy(keyResultStatuss, 'confidence').confidence,
      createdAt: latestKeyResultCheckIn.createdAt,
    }

    return objectiveStatus
  }

  private buildDefaultStatus(
    date?: Date,
    progress: number = DEFAULT_PROGRESS,
    confidence: number = DEFAULT_CONFIDENCE,
  ) {
    date ??= new Date()

    const defaultStatus = {
      progress,
      confidence,
      createdAt: date,
    }

    return defaultStatus
  }

  private async getCurrentProgressForObjective(objective: ObjectiveInterface): Promise<number> {
    const date = new Date()
    const currentStatus = await this.getStatusAtDate(date, objective)

    return currentStatus?.progress ?? DEFAULT_PROGRESS
  }

  private async getLastWeekProgressForObjective(objective: ObjectiveInterface): Promise<number> {
    const firstDayAfterLastWeek = this.getFirstDayAfterLastWeek()

    const lastWeekStatus = await this.getStatusAtDate(firstDayAfterLastWeek, objective)

    return lastWeekStatus?.progress ?? DEFAULT_PROGRESS
  }
}
