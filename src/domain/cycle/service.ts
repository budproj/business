import { Injectable } from '@nestjs/common'
import { orderBy, filter } from 'lodash'

import { CycleDTO } from 'src/domain/cycle/dto'
import { DomainCreationQuery, DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { TeamDTO } from 'src/domain/team/dto'
import DomainTeamService from 'src/domain/team/service'
import { UserDTO } from 'src/domain/user/dto'

import { Cycle } from './entities'
import DomainCycleRepository from './repository'

export interface DomainCycleServiceInterface {
  getFromTeam: (team: TeamDTO) => Promise<Cycle[]>
  getClosestToEndFromTeam: (team: TeamDTO, snapshot?: Date) => Promise<Cycle | undefined>
  getFromTeamListCompanies: (team: TeamDTO[]) => Promise<Cycle[]>
  getFromUserTeams: (user: UserDTO) => Promise<Cycle[]>
  getFromTeamList: (teams: TeamDTO[]) => Promise<Cycle[]>
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

  public async getFromTeamListCompanies(_teams: TeamDTO[]) {
    // Following https://getbud.atlassian.net/browse/BBCR-99?focusedCommentId=10061 we've decided
    // to abort this feature for now. We're going to do it again during the cycle story
    // PLAN
    // Fetch companies list from teams
    // Fetch full node list of companies
    // Fetch cycles from any of those nodes
    return []
  }

  public async getFromUserTeams(_user: UserDTO) {
    // Following https://getbud.atlassian.net/browse/BBCR-99?focusedCommentId=10061 we've decided
    // to abort this feature for now. We're going to do it again during the cycle story
    return []
  }

  public async getFromTeamList(_teams: TeamDTO[]) {
    // Following https://getbud.atlassian.net/browse/BBCR-99?focusedCommentId=10061 we've decided
    // to abort this feature for now. We're going to do it again during the cycle story
    return []
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
