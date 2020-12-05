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

  async getUserFromSubjectWithTeamRelation(authzSub: UserDTO['authzSub']): Promise<User> {
    return this.repository.findOne({ authzSub }, { relations: ['teams'] })
  }

  async canUserReadForCompany(
    selector: FindConditions<User>,
    userCompanies: Array<CompanyDTO['id']>,
  ): Promise<boolean> {
    const relatedTeams = await this.repository.findRelatedTeams(selector)
    const relatedCompanies = new Set(relatedTeams.map((team) => team.companyId))
    const canUserRead = userCompanies.some((company) => relatedCompanies.has(company))

    return canUserRead
  }

  async canUserReadForTeam(
    selector: FindConditions<User>,
    userTeams: Array<TeamDTO['id']>,
  ): Promise<boolean> {
    const relatedTeams = await this.repository.findRelatedTeams(selector)
    const relatedTeamIDs = new Set(relatedTeams.map((team) => team.id))
    const canUserRead = userTeams.some((team) => relatedTeamIDs.has(team))

    return canUserRead
  }

  async canUserReadForSelf(selector: FindConditions<User>, user: UserDTO): Promise<boolean> {
    return user.id === selector.id
  }
}

export default DomainUserService
