import { Injectable } from '@nestjs/common'
import { orderBy, filter, omitBy, groupBy, mapValues, flatten } from 'lodash'
import { Any } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { LodashSorting } from '@core/enums/lodash-sorting'
import { Sorting } from '@core/enums/sorting'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { TeamInterface } from '@core/modules/team/team.interface'
import { TeamProvider } from '@core/modules/team/team.provider'
import { CreationQuery } from '@core/types/creation-query.type'

import { CADENCE_RANK } from './cycle.constants'
import { CycleInterface } from './cycle.interface'
import { Cycle } from './cycle.orm-entity'
import { CycleRepository } from './cycle.repository'

@Injectable()
export class CycleProvider extends CoreEntityProvider<Cycle, CycleInterface> {
  constructor(
    protected readonly repository: CycleRepository,
    private readonly teamProvider: TeamProvider,
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
  ): Promise<Cycle[]> {
    const teamIDsFilter = Any(teams.map((team) => team.id))
    const cycles = await this.repository.find({
      ...filters,
      teamId: teamIDsFilter,
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
  ): Promise<Cycle[]> {
    const parentIDsFilter = Any(parentIDs)
    const teamIDsFilter = Any(teams.map((team) => team.id))

    const selectedCycles = await this.repository.find({
      parentId: parentIDsFilter,
      teamId: teamIDsFilter,
      ...filters,
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
}
