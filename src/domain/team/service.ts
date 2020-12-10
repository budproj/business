import { Injectable } from '@nestjs/common'

import { CompanyDTO } from 'domain/company/dto'
import DomainEntityService from 'domain/service'
import { UserDTO } from 'domain/user/dto'

import { TeamDTO } from './dto'
import { Team } from './entities'
import DomainTeamRepository from './repository'

@Injectable()
class DomainTeamService extends DomainEntityService<Team, TeamDTO> {
  constructor(public readonly repository: DomainTeamRepository) {
    super(repository, DomainTeamService.name)
  }

  async getFromCompany(companyId: CompanyDTO['id']): Promise<Team[]> {
    return this.repository.find({ companyId })
  }

  async getFromOwner(ownerId: UserDTO['id']): Promise<Team[]> {
    return this.repository.find({ ownerId })
  }
}

export default DomainTeamService
