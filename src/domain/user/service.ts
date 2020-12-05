import { Injectable } from '@nestjs/common'
import { FindConditions } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import DomainEntityService from 'domain/service'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { User } from './entities'
import DomainUserRepository from './repository'
import DomainUserViewService from './view/service'

@Injectable()
class DomainUserService extends DomainEntityService<User, UserDTO> {
  constructor(
    public readonly view: DomainUserViewService,
    public readonly repository: DomainUserRepository,
  ) {
    super(repository, DomainUserService.name)
  }

  async canUserReadForCompany(
    selector: FindConditions<User>,
    userCompanies: Array<CompanyDTO['id']>,
  ): Promise<boolean> {
    const relatedTeams = await this.repository.findRelatedTeams(selector)
    const relatedCompanies = relatedTeams.map((team) => team.companyId)
    const canUserRead = relatedCompanies.every((company) => userCompanies.includes(company))

    return canUserRead
  }

  async canUserReadForTeam(
    selector: FindConditions<User>,
    userTeams: Array<TeamDTO['id']>,
  ): Promise<boolean> {
    const relatedTeams = await this.repository.findRelatedTeams(selector)
    const relatedTeamIDs = relatedTeams.map((team) => team.id)
    const canUserRead = relatedTeamIDs.every((team) => userTeams.includes(team))

    return canUserRead
  }

  async canUserReadForSelf(selector: FindConditions<User>, user: UserDTO): Promise<boolean> {
    return user.id === selector.id
  }

  async getUserFromSubjectWithTeamRelation(authzSub: UserDTO['authzSub']): Promise<User> {
    return this.repository.findOne({ authzSub }, { relations: ['teams'] })
  }
}

export default DomainUserService
