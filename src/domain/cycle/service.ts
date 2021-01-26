import { Injectable } from '@nestjs/common'

import { CycleDTO } from 'src/domain/cycle/dto'
import { DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { TeamDTO } from 'src/domain/team/dto'
import DomainTeamService from 'src/domain/team/service'

import { Cycle } from './entities'
import DomainCycleRepository from './repository'

export interface DomainCycleServiceInterface {
  repository: DomainCycleRepository

  getFromTeam: (team: TeamDTO) => Promise<Cycle[]>
}

@Injectable()
class DomainCycleService
  extends DomainEntityService<Cycle, CycleDTO>
  implements DomainCycleServiceInterface {
  constructor(
    public readonly repository: DomainCycleRepository,
    private readonly teamService: DomainTeamService,
  ) {
    super(repository, DomainCycleService.name)
  }

  public async getFromTeam(team: TeamDTO) {
    const cycles = await this.repository.find({ teamId: team.id })
    if (cycles.length === 0) return this.getFromParentTeam(team)

    return cycles
  }

  protected async createIfUserIsInCompany(
    _data: Partial<Cycle>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  protected async createIfUserIsInTeam(_data: Partial<Cycle>, _queryContext: DomainQueryContext) {
    return {} as any
  }

  protected async createIfUserOwnsIt(_data: Partial<Cycle>, _queryContext: DomainQueryContext) {
    return {} as any
  }

  private async getFromParentTeam(childTeam: TeamDTO) {
    const parentTeam = await this.teamService.getParentTeam(childTeam)

    return this.getFromTeam(parentTeam)
  }
}

export default DomainCycleService
