import { Injectable } from '@nestjs/common'
import { orderBy, filter, omitBy, groupBy, mapValues, flatten } from 'lodash'
import { Any, FindConditions } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { LodashSorting } from '@core/enums/lodash-sorting'
import { Sorting } from '@core/enums/sorting'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { CreationQuery } from '@core/types/creation-query.type'

import { CADENCE_RANK } from './cycle.constants'
import { Cycle } from './cycle.orm-entity'
import { CycleRepository } from './cycle.repository'
import { CycleSpecification } from './cycle.specification'
import { CycleInterface } from './interfaces/cycle.interface'

@Injectable()
export class CycleProvider extends CoreEntityProvider<Cycle, CycleInterface> {
  private readonly specification = new CycleSpecification()

  constructor(protected readonly repository: CycleRepository) {
    super(CycleProvider.name, repository)
  }

  public async getFromTeamsWithFilters(
    teams: TeamInterface[],
    filters?: Partial<CycleInterface>,
    options?: GetOptions<Cycle>,
  ): Promise<Cycle[]> {
    const teamIDsFilter = Any(teams.map((team) => team.id))
    const getOptions = this.repository.marshalGetOptions(options)
    const whereSelector = {
      ...filters,
      teamId: teamIDsFilter,
    }

    return this.repository.find({
      ...getOptions,
      where: whereSelector,
    })
  }

  public sortCyclesByCadence(cycles: Cycle[], sorting?: Sorting): Cycle[] {
    if (!sorting) return cycles

    const rankedCycles = cycles.map((cycle) => ({
      ...cycle,
      rank: CADENCE_RANK[cycle.cadence],
    }))
    const sortedRawCycles = orderBy<Cycle>(rankedCycles, 'rank', LodashSorting[sorting])

    return sortedRawCycles.map((cycle) => omitBy(cycle, 'rank') as Cycle)
  }

  public async getChildCycles(
    parentCycle: CycleInterface,
    filters?: FindConditions<Cycle>,
    options?: GetOptions<Cycle>,
  ): Promise<Cycle[]> {
    const whereSelector = {
      ...filters,
      parentId: parentCycle.id,
    }

    return this.repository.find({
      ...options,
      where: whereSelector,
    })
  }

  public async getCyclesInSamePeriodFromTeamsAndParentIDsWithFilters(
    teams: TeamInterface[],
    parentIDs: Array<CycleInterface['id']>,
    filters?: Partial<CycleInterface>,
    options?: GetOptions<Cycle>,
  ): Promise<Cycle[]> {
    const parentIDsFilter = Any(parentIDs)
    const teamIDsFilter = Any(teams.map((team) => team.id))
    const getOptions = this.repository.marshalGetOptions(options)
    const whereSelector = {
      parentId: parentIDsFilter,
      teamId: teamIDsFilter,
      ...filters,
    }

    const selectedCycles = await this.repository.find({
      ...getOptions,
      where: whereSelector,
    })

    const groupedByPeriodCycles = groupBy(selectedCycles, 'period')
    const commonCyclesGroupedByPeriod = filter(
      mapValues(groupedByPeriodCycles, (cycles) => {
        const hasCyclesInAllParents = parentIDs.every((parentID) =>
          cycles.some((cycle) => cycle.parentId === parentID),
        )

        return hasCyclesInAllParents ? cycles : undefined
      }),
    )

    return flatten(commonCyclesGroupedByPeriod)
  }

  public async getFromObjective(objective: ObjectiveInterface): Promise<Cycle> {
    return this.repository.findOne({ id: objective.cycleId })
  }

  public async isActiveFromIndexes(cycleIndexes: Partial<CycleInterface>): Promise<boolean> {
    const cycle = await this.repository.findOne(cycleIndexes)

    return this.specification.isActive.isSatisfiedBy(cycle)
  }

  public async getFromIndexes(indexes: Partial<CycleInterface>): Promise<Cycle> {
    return this.repository.findOne(indexes)
  }

  protected async protectCreationQuery(
    _query: CreationQuery<Cycle>,
    _data: Partial<CycleInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }
}
