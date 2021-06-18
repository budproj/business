import { Injectable } from '@nestjs/common'
import { Any, FindConditions } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CreationQuery } from '@core/types/creation-query.type'

import { ObjectiveInterface } from './interfaces/objective.interface'
import { DEFAULT_CONFIDENCE, DEFAULT_PROGRESS } from './objective.constants'
import { Objective } from './objective.orm-entity'
import { ObjectiveRepository } from './objective.repository'

@Injectable()
export class ObjectiveProvider extends CoreEntityProvider<Objective, ObjectiveInterface> {
  constructor(protected readonly repository: ObjectiveRepository) {
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

  public async getFromID(id: string): Promise<Objective> {
    return this.repository.findOne({ id })
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

  public async getFromIndexes(indexes: Partial<ObjectiveInterface>): Promise<Objective> {
    return this.repository.findOne(indexes)
  }

  public async getFromTeamWithCycleFilters(
    teamID: string,
    cycleFilters?: Partial<CycleInterface>,
  ): Promise<Objective[]> {
    return this.repository.getFromTeamWithRelationFilters(teamID, {
      cycle: cycleFilters,
    })
  }

  protected async protectCreationQuery(
    _query: CreationQuery<Objective>,
    _data: Partial<ObjectiveInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }

  private async getFromIDListAndCycleActiveStatus(
    ids: string[],
    cycleIsActive: boolean,
    options?: GetOptions<Objective>,
  ): Promise<Objective[]> {
    return this.repository.getFromCycleStatus(cycleIsActive, ids, options)
  }
}
