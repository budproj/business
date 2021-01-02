import { Injectable } from '@nestjs/common'
import { uniq } from 'lodash'

import { CycleDTO } from 'domain/cycle/dto'
import DomainEntityService from 'domain/service'
import { TeamDTO } from 'domain/team/dto'
import DomainTeamService from 'domain/team/service'
import { UserDTO } from 'domain/user/dto'

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
    const companiesTeams = await this.teamService.getCompanyTeams(companyIDs)
    const companiesTeamIDs = uniq(companiesTeams.map((team) => team.id))

    return companiesTeamIDs
  }

  async getFromCompany(companyId: TeamDTO['id']): Promise<Cycle[]> {
    // TODO
    return this.repository.find({ teamId: companyId })
  }
}

export default DomainCycleService
