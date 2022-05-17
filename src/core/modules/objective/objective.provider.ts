import { Injectable } from '@nestjs/common'
import { omitBy, isEmpty } from 'lodash'
import { Any, FindConditions, In } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CreationQuery } from '@core/types/creation-query.type'
import { EntityOrderAttributes } from '@core/types/order-attribute.type'

import { TeamInterface } from '../team/interfaces/team.interface'

import { ObjectiveInterface } from './interfaces/objective.interface'
import { DEFAULT_CONFIDENCE, DEFAULT_PROGRESS } from './objective.constants'
import { Objective } from './objective.orm-entity'
import { ObjectiveRelationFilterProperties, ObjectiveRepository } from './objective.repository'

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

  public async getActiveObjectivesQuantity(teamsIds: Array<TeamInterface['id']>) {
    return this.repository.count({
      relations: ['cycle'],
      where: {
        teamId: In(teamsIds),
        cycle: {
          active: true,
        },
      },
    })
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

  public async getFromIndexes(indexes: Partial<ObjectiveInterface>): Promise<Objective> {
    return this.repository.findOne(indexes)
  }

  public async isActive(id: string): Promise<boolean> {
    const objectiveWithCycle = await this.repository.findOne({
      where: { id },
      relations: ['cycle'],
    })

    return objectiveWithCycle.cycle.active
  }

  public async getWithRelationFilters(
    filters: ObjectiveRelationFilterProperties,
    entityOrderAttributes?: EntityOrderAttributes[],
  ): Promise<Objective[]> {
    const orderAttributes = this.marshalEntityOrderAttributes(entityOrderAttributes)
    const cleanedRelationFilters = omitBy(
      {
        objective: typeof filters.objective === undefined ? {} : filters.objective,
        cycle: typeof filters.cycle === undefined ? {} : filters.cycle,
        keyResult: typeof filters.keyResult === undefined ? {} : filters.keyResult,
      },
      isEmpty,
    )

    return this.repository.findWithRelationFilters(cleanedRelationFilters, orderAttributes)
  }

  public async createObjective(objectiveData: ObjectiveInterface): Promise<Objective> {
    const [queryResult] = await this.create(objectiveData)
    return queryResult
  }

  protected async protectCreationQuery(
    _query: CreationQuery<Objective>,
    _data: Partial<ObjectiveInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }
}
