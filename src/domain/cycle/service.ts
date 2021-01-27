import { Injectable } from '@nestjs/common'

import { CycleDTO } from 'src/domain/cycle/dto'
import { DomainCreationQuery, DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { TeamDTO } from 'src/domain/team/dto'
import DomainTeamService from 'src/domain/team/service'

import { Cycle } from './entities'
import DomainCycleRepository from './repository'

export interface DomainCycleServiceInterface {
  getFromTeam: (team: TeamDTO) => Promise<Cycle[]>
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
    if (cycles.length === 0) return this.getFromParentTeam(team)

    return cycles
  }

  protected async protectCreationQuery(
    _query: DomainCreationQuery<Cycle>,
    _data: Partial<CycleDTO>,
    _queryContext: DomainQueryContext,
  ) {
    return []
  }

  private async getFromParentTeam(childTeam: TeamDTO) {
    const parentTeam = await this.teamService.getParentTeam(childTeam)

    return this.getFromTeam(parentTeam)
  }
}

export default DomainCycleService
