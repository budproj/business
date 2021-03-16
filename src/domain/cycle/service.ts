import { Injectable } from '@nestjs/common'
import { orderBy, filter, maxBy, meanBy, minBy, omitBy } from 'lodash'
import { Any } from 'typeorm'

import { DOMAIN_SORTING, LODASH_SORTING } from 'src/domain/constants'
import { CycleDTO } from 'src/domain/cycle/dto'
import { DomainCreationQuery, DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { DomainKeyResultStatus } from 'src/domain/key-result/service'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { Objective } from 'src/domain/objective/entities'
import DomainObjectiveService, { DomainObjectiveStatus } from 'src/domain/objective/service'
import { TeamDTO } from 'src/domain/team/dto'
import DomainTeamService from 'src/domain/team/service'

import { DEFAULT_PROGRESS, DEFAULT_CONFIDENCE, CADENCE_RANK } from './constants'
import { Cycle } from './entities'
import DomainCycleRepository from './repository'

export interface DomainCycleServiceInterface {
  getFromTeam: (team: TeamDTO) => Promise<Cycle[]>
  getFromObjective: (objective: ObjectiveDTO) => Promise<Cycle>
  getClosestToEndFromTeam: (team: TeamDTO, snapshot?: Date) => Promise<Cycle | undefined>
  getFromTeamsWithFilters: (teams: TeamDTO[], filters?: Partial<CycleDTO>) => Promise<Cycle[]>
  getCurrentStatus: (cycle: CycleDTO) => Promise<DomainCycleStatus>
  sortCyclesByCadence: (cycles: Cycle[], sorting?: DOMAIN_SORTING) => Cycle[]
}

export interface DomainCycleStatus extends DomainKeyResultStatus {
  latestObjectiveStatus?: DomainObjectiveStatus
}

@Injectable()
class DomainCycleService
  extends DomainEntityService<Cycle, CycleDTO>
  implements DomainCycleServiceInterface {
  constructor(
    protected readonly repository: DomainCycleRepository,
    private readonly teamService: DomainTeamService,
    private readonly objectiveService: DomainObjectiveService,
  ) {
    super(DomainCycleService.name, repository)
  }

  public async getFromTeam(team: TeamDTO) {
    const cycles = await this.repository.find({ teamId: team.id })

    return cycles
  }

  public async getFromObjective(objective: ObjectiveDTO) {
    return this.repository.findOne({ id: objective.cycleId })
  }

  public async getClosestToEndFromTeam(team: TeamDTO, snapshot?: Date) {
    snapshot ??= new Date()
    const relatedCycles = await this.getAllRelatedToTeam(team)

    const cyclesAfterDate = this.filterCyclesAfterDate(relatedCycles, snapshot)
    const closestCycle = orderBy(cyclesAfterDate, ['dateEnd', 'createdAt'], ['asc', 'desc'])[0]

    return closestCycle
  }

  public async getFromTeamsWithFilters(teams: TeamDTO[], filters?: Partial<CycleDTO>) {
    const teamIDsFilter = Any(teams.map((team) => team.id))
    const selector = {
      ...filters,
      teamId: teamIDsFilter,
    }

    // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
    const cycles = await this.repository.find(selector)

    return cycles
  }

  public async getCurrentStatus(cycle: CycleDTO) {
    const date = new Date()
    const cycleStatus = await this.getStatusAtDate(date, cycle)

    return cycleStatus
  }

  public sortCyclesByCadence(cycles: Cycle[], sorting?: DOMAIN_SORTING) {
    if (!sorting) return cycles

    const rankedCycles = cycles.map((cycle) => ({
      ...cycle,
      rank: CADENCE_RANK[cycle.cadence],
    }))
    const sortedRawCycles = orderBy<Cycle>(rankedCycles, 'rank', LODASH_SORTING[sorting])
    const sortedCycles = sortedRawCycles.map((cycle) => omitBy(cycle, 'rank') as Cycle)

    return sortedCycles
  }

  protected async protectCreationQuery(
    _query: DomainCreationQuery<Cycle>,
    _data: Partial<CycleDTO>,
    _queryContext: DomainQueryContext,
  ) {
    return []
  }

  private async getAllRelatedToTeam(team: TeamDTO) {
    const relatedTeams = await this.teamService.getFullTeamNodesTree(team)
    const selector = {
      teamId: Any(relatedTeams),
    }
    const cycles = await this.repository.find({ where: selector })

    return cycles
  }

  private filterCyclesAfterDate(cycles: Cycle[], snapshot: Date) {
    const cyclesAfterDate = filter(cycles, (cycle) => cycle.dateEnd >= snapshot)

    return cyclesAfterDate
  }

  private async getStatusAtDate(date: Date, cycle: CycleDTO) {
    const objectives = await this.objectiveService.getFromCycle(cycle)
    if (!objectives || objectives.length === 0) return this.buildDefaultStatus(date)

    const cycleStatus = await this.buildStatusAtDate(date, objectives)

    return cycleStatus
  }

  private buildDefaultStatus(
    date?: DomainCycleStatus['createdAt'],
    progress: DomainCycleStatus['progress'] = DEFAULT_PROGRESS,
    confidence: DomainCycleStatus['confidence'] = DEFAULT_CONFIDENCE,
  ) {
    date ??= new Date()

    const defaultStatus: DomainCycleStatus = {
      progress,
      confidence,
      createdAt: date,
    }

    return defaultStatus
  }

  private async buildStatusAtDate(
    date: Date,
    objectives: Objective[],
  ): Promise<DomainCycleStatus | undefined> {
    const objectiveStatusPromises = objectives.map(async (objective) =>
      this.objectiveService.getStatusAtDate(date, objective),
    )
    const objectiveStatuss = await Promise.all(objectiveStatusPromises)
    const latestObjectiveStatus = maxBy(objectiveStatuss, 'createdAt')
    if (!latestObjectiveStatus) return

    const cycleStatus: DomainCycleStatus = {
      latestObjectiveStatus,
      progress: meanBy(objectiveStatuss, 'progress'),
      confidence: minBy(objectiveStatuss, 'confidence').confidence,
      createdAt: latestObjectiveStatus.createdAt,
    }

    return cycleStatus
  }
}

export default DomainCycleService
