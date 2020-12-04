import { Injectable } from '@nestjs/common'

import { CompanyDTO } from 'domain/company/dto'
import DomainService from 'domain/service'
import { UserDTO } from 'domain/user/dto'

import { TeamDTO } from './dto'
import { Team } from './entities'
import DomainTeamRepository from './repository'

@Injectable()
class DomainTeamService extends DomainService<Team, TeamDTO> {
  constructor(public readonly repository: DomainTeamRepository) {
    super(repository, DomainTeamService.name)
  }

  async getFromCompany(companyId: CompanyDTO['id']): Promise<Team[]> {
    return this.repository.find({ companyId })
  }
}

export default DomainTeamService
