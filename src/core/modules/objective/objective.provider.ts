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

  static buildDefaultStatus(
    date?: Date,
    progress: number = DEFAULT_PROGRESS,
    confidence: number = DEFAULT_CONFIDENCE,
  ) {
    date ??= new Date()

    return {
      progress,
      confidence,
      createdAt: date,
    }
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
    cycle: Partial<CycleInterface>,
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

  public async getStatusAtDate(
    date: Date,
    objective: ObjectiveInterface,
  ): Promise<ObjectiveStatus | undefined> {
    const keyResults = await this.keyResultProvider.getFromObjective(objective)
    if (!keyResults || keyResults.length === 0) return

    return this.buildStatusAtDate(date, keyResults)
  }

  public async getObjectiveProgressIncreaseSinceLastWeek(
    objective: ObjectiveInterface,
  ): Promise<number> {
    const progress = await this.getCurrentProgressForObjective(objective)
    const lastWeekProgress = await this.getLastWeekProgressForObjective(objective)

    return progress - lastWeekProgress
  }

  public async getFromIDList(
    ids: string[],
    indexes?: Partial<ObjectiveInterface>,
    options?: GetOptions<Objective>,
  ): Promise<Objective[]> {
    const selector = {
      ...indexes,
      id: Any(ids),
    }

    return this.repository.find({
      ...options,
      where: selector,
    })
  }

  public async getActiveFromIDList(
    ids: string[],
    _indexes?: Partial<ObjectiveInterface>,
    options?: GetOptions<Objective>,
  ): Promise<Objective[]> {
    return this.getFromIDListAndCycleActiveStatus(ids, true, options)
  }

  public async getNotActiveFromIDList(
    ids: string[],
    _indexes?: Partial<ObjectiveInterface>,
    options?: GetOptions<Objective>,
  ): Promise<Objective[]> {
    return this.getFromIDListAndCycleActiveStatus(ids, false, options)
  }

  public async getFromTeams(
    team: Partial<TeamInterface> | Array<Partial<TeamInterface>>,
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

    return this.repository.find({
      ...options,
      where: whereSelector,
    })
  }

  public async getFromIndexes(indexes: Partial<ObjectiveInterface>): Promise<Objective> {
    return this.repository.findOne(indexes)
  }

  public async getActivesFromTeam(teamID: string): Promise<Objective[]> {
    const allObjectives = await this.getFromTeams({ id: teamID })
    const allObjectiveIDs = allObjectives.map((objective) => objective.id)

    return this.repository.getFromCycleStatus(true, allObjectiveIDs)
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
      this.keyResultProvider.getLatestCheckInForKeyResultAtDate(keyResult.id, date),
    )
    const keyResultStatus = await Promise.all(keyResultStatusPromises)
    const latestKeyResultCheckIn = maxBy(keyResultStatus, 'createdAt')
    if (!latestKeyResultCheckIn) return ObjectiveProvider.buildDefaultStatus(date)

    const progress = this.keyResultProvider.calculateKeyResultCheckInListAverageProgress(
      keyResultStatus,
      keyResults,
    )

    return {
      latestKeyResultCheckIn,
      progress,
      confidence: minBy(keyResultStatus, 'confidence').confidence,
      createdAt: latestKeyResultCheckIn.createdAt,
    }
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

  private async getFromIDListAndCycleActiveStatus(
    ids: string[],
    cycleIsActive: boolean,
    options?: GetOptions<Objective>,
  ): Promise<Objective[]> {
    return this.repository.getFromCycleStatus(cycleIsActive, ids, options)
  }
}
