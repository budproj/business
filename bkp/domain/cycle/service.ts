import { Injectable } from '@nestjs/common'
import { uniq } from 'lodash'

import { CycleDTO } from 'src/domain/cycle/dto'
import DomainEntityService from 'src/domain/service'
import { TeamDTO } from 'src/domain/team/dto'
import DomainTeamService from 'src/domain/team/service'
import { UserDTO } from 'src/domain/user/dto'

import { Cycle } from './entities'
import DomainCycleRepository from './repository'

@Injectable()
class DomainCycleService extends DomainEntityService<Cycle, CycleDTO> {
  constructor(
    public readonly repository: DomainCycleRepository,
    private readonly teamService: DomainTeamService,
  ) {
    super(repository, DomainCycleService.name)
  }

  async parseUserCompanyIDs(user: UserDTO) {
    const userCompanies = await this.teamService.getUserCompanies(user)
    const userCompanyIDs = uniq(userCompanies.map((company) => company.id))

    return userCompanyIDs
  }

  async parseUserCompaniesTeamIDs(companyIDs: Array<TeamDTO['id']>) {
    const companiesTeams = await this.teamService.getAllTeamsBelowNodes(companyIDs)
    const companiesTeamIDs = uniq(companiesTeams.map((team) => team.id))

    return companiesTeamIDs
  }

  async getFromTeam(teamId: TeamDTO['id']) {
    const cycles = await this.repository.find({ teamId })
    if (cycles.length === 0) return this.getFromParentTeam(teamId)

    return cycles
  }

  async getFromParentTeam(childTeamID: TeamDTO['id']) {
    const parentTeam = await this.teamService.getParentTeam(childTeamID)

    return this.getFromTeam(parentTeam.id)
  }
}

export default DomainCycleService
