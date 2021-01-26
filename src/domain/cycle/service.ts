import { Injectable } from '@nestjs/common'

import { CycleDTO } from 'src/domain/cycle/dto'
import { DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { TeamDTO } from 'src/domain/team/dto'
import DomainTeamService from 'src/domain/team/service'

import { Cycle } from './entities'
import DomainCycleRepository from './repository'

export interface DomainCycleServiceInterface {
  getFromTeam: (teamId: TeamDTO['id']) => Promise<Cycle[]>
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

  public async getFromTeam(teamId: TeamDTO['id']) {
    const cycles = await this.repository.find({ teamId })
    if (cycles.length === 0) return this.getFromParentTeam(teamId)

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

  private async getFromParentTeam(childTeamID: TeamDTO['id']) {
    const parentTeam = await this.teamService.getParentTeam(childTeamID)

    return this.getFromTeam(parentTeam.id)
  }
}

export default DomainCycleService
