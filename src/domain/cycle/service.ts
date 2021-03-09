import { Injectable } from '@nestjs/common'
import { orderBy, filter } from 'lodash'
import { Any } from 'typeorm'

import { CycleDTO } from 'src/domain/cycle/dto'
import { DomainCreationQuery, DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { TeamDTO } from 'src/domain/team/dto'
import DomainTeamService from 'src/domain/team/service'

import { Cycle } from './entities'
import DomainCycleRepository from './repository'

export interface DomainCycleServiceInterface {
  getFromTeam: (team: TeamDTO) => Promise<Cycle[]>
  getClosestToEndFromTeam: (team: TeamDTO, snapshot?: Date) => Promise<Cycle | undefined>
  getFromTeamsWithFilters: (teams: TeamDTO[], filters?: Partial<CycleDTO>) => Promise<Cycle[]>
}

@Injectable()
class DomainCycleService
  extends DomainEntityService<Cycle, CycleDTO>
  implements DomainCycleServiceInterface {
  constructor(
    protected readonly repository: DomainCycleRepository,
    private readonly teamService: DomainTeamService,
  ) {
    super(DomainCycleService.name, repository)
  }

  public async getFromTeam(team: TeamDTO) {
    const cycles = await this.repository.find({ teamId: team.id })

    return cycles
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

  protected async protectCreationQuery(
    _query: DomainCreationQuery<Cycle>,
    _data: Partial<CycleDTO>,
    _queryContext: DomainQueryContext,
  ) {
    return []
  }

  private async getAllRelatedToTeam(team: TeamDTO) {
    const relatedTeams = await this.teamService.getFullTeamNodesTree(team)
    const cycles = await this.repository.findFromTeams(relatedTeams)

    return cycles
  }

  private filterCyclesAfterDate(cycles: Cycle[], snapshot: Date) {
    const cyclesAfterDate = filter(cycles, (cycle) => cycle.dateEnd >= snapshot)

    return cyclesAfterDate
  }
}

export default DomainCycleService
