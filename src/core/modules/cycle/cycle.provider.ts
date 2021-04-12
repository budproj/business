import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { orderBy, filter, omitBy, groupBy, mapValues, flatten, maxBy, meanBy, minBy } from 'lodash'
import { Any } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { LodashSorting } from '@core/enums/lodash-sorting'
import { Sorting } from '@core/enums/sorting'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { TeamInterface } from '@core/modules/team/team.interface'
import { TeamProvider } from '@core/modules/team/team.provider'
import { CreationQuery } from '@core/types/creation-query.type'

import { Objective } from '../objective/objective.orm-entity'
import { ObjectiveProvider } from '../objective/objective.provider'

import { CADENCE_RANK, DEFAULT_CONFIDENCE, DEFAULT_PROGRESS } from './cycle.constants'
import { Cycle } from './cycle.orm-entity'
import { CycleRepository } from './cycle.repository'
import { CycleSpecification } from './cycle.specification'
import { CycleStatus } from './interfaces/cycle-status.interface'
import { CycleInterface } from './interfaces/cycle.interface'

@Injectable()
export class CycleProvider extends CoreEntityProvider<Cycle, CycleInterface> {
  private readonly specification = new CycleSpecification()

  constructor(
    protected readonly repository: CycleRepository,
    private readonly teamProvider: TeamProvider,
    @Inject(forwardRef(() => ObjectiveProvider))
    private readonly objectiveProvider: ObjectiveProvider,
  ) {
    super(CycleProvider.name, repository)
  }

  public async getFromTeam(team: TeamInterface): Promise<Cycle[]> {
    const cycles = await this.repository.find({ teamId: team.id })

    return cycles
  }

  public async getClosestToEndFromTeam(
    team: TeamInterface,
    snapshot?: Date,
  ): Promise<Cycle | undefined> {
    snapshot ??= new Date()
    const relatedCycles = await this.getAllRelatedToTeam(team)

    const cyclesAfterDate = this.filterCyclesAfterDate(relatedCycles, snapshot)
    const closestCycle = orderBy(cyclesAfterDate, ['dateEnd', 'createdAt'], ['asc', 'desc'])[0]

    return closestCycle
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

    const cycles = await this.repository.find({
      ...getOptions,
      where: whereSelector,
    })

    return cycles
  }

  public sortCyclesByCadence(cycles: Cycle[], sorting?: Sorting): Cycle[] {
    if (!sorting) return cycles

    const rankedCycles = cycles.map((cycle) => ({
      ...cycle,
      rank: CADENCE_RANK[cycle.cadence],
    }))
    const sortedRawCycles = orderBy<Cycle>(rankedCycles, 'rank', LodashSorting[sorting])
    const sortedCycles = sortedRawCycles.map((cycle) => omitBy(cycle, 'rank') as Cycle)

    return sortedCycles
  }

  public async getChildCycles(
    parentCycle: CycleInterface,
    filters?: Partial<CycleInterface>,
  ): Promise<Cycle[]> {
    const cycles = await this.repository.find({
      ...filters,
      parentId: parentCycle.id,
    })

    return cycles
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

    const cycles = flatten(commonCyclesGroupedByPeriod)

    return cycles
  }

  public async getFromObjective(objective: ObjectiveInterface): Promise<Cycle> {
    return this.repository.findOne({ id: objective.cycleId })
  }

  public async isActiveFromIndexes(cycleIndexes: Partial<CycleInterface>): Promise<boolean> {
    const cycle = await this.repository.findOne(cycleIndexes)

    return this.specification.isActive.isSatisfiedBy(cycle)
  }

  public async getCurrentStatus(cycle: CycleInterface): Promise<CycleStatus> {
    const date = new Date()
    const cycleStatus = await this.getStatusAtDate(date, cycle)

    return cycleStatus
  }

  protected async protectCreationQuery(
    _query: CreationQuery<Cycle>,
    _data: Partial<CycleInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }

  private async getAllRelatedToTeam(team: TeamInterface): Promise<Cycle[]> {
    const relatedTeams = await this.teamProvider.getFullTeamNodesTree(team)
    const selector = {
      teamId: Any(relatedTeams),
    }
    const cycles = await this.repository.find({ where: selector })

    return cycles
  }

  private filterCyclesAfterDate(cycles: Cycle[], snapshot: Date): Cycle[] {
    const cyclesAfterDate = filter(cycles, (cycle) => cycle.dateEnd >= snapshot)

    return cyclesAfterDate
  }

  private async getStatusAtDate(date: Date, cycle: CycleInterface) {
    const objectives = await this.objectiveProvider.getFromCycle(cycle)
    if (!objectives || objectives.length === 0) return this.buildDefaultStatus(date)

    const cycleStatus = await this.buildStatusAtDate(date, objectives)

    return cycleStatus
  }

  private async buildStatusAtDate(
    date: Date,
    objectives: Objective[],
  ): Promise<CycleStatus | undefined> {
    const objectiveStatusPromises = objectives.map(async (objective) =>
      this.objectiveProvider.getStatusAtDate(date, objective),
    )
    const objectiveStatuss = await Promise.all(objectiveStatusPromises)
    const latestObjectiveStatus = maxBy(objectiveStatuss, 'createdAt')
    if (!latestObjectiveStatus) return

    const cycleStatus: CycleStatus = {
      latestObjectiveStatus,
      progress: meanBy(objectiveStatuss, 'progress'),
      confidence: minBy(objectiveStatuss, 'confidence').confidence,
      createdAt: latestObjectiveStatus.createdAt,
    }

    return cycleStatus
  }

  private buildDefaultStatus(
    date?: Date,
    progress: number = DEFAULT_PROGRESS,
    confidence: number = DEFAULT_CONFIDENCE,
  ) {
    date ??= new Date()

    const defaultStatus: CycleStatus = {
      progress,
      confidence,
      createdAt: date,
    }

    return defaultStatus
  }
}
