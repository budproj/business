import { Injectable, Logger } from '@nestjs/common'
import { uniq } from 'lodash'

import { CompanyDTO } from 'domain/company/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { User } from './entities'
import DomainUserRepository from './repository'
import DomainUserViewService from './view/service'

@Injectable()
class DomainUserService {
  private readonly logger = new Logger(DomainUserService.name)

  constructor(
    public readonly view: DomainUserViewService,
    private readonly repository: DomainUserRepository,
  ) {}

  async getOneById(id: UserDTO['id']): Promise<User> {
    return this.repository.findOne({ id })
  }

  async getOneByIdIfUserShareCompany(id: UserDTO['id'], user: UserDTO): Promise<User | null> {
    const userCompanies = await this.parseRequestUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const data = await this.repository.findByIDWithCompanyConstraint(id, userCompanies)

    return data
  }

  async getOneByIdIfUserShareTeam(id: UserDTO['id'], user: UserDTO): Promise<User | null> {
    const userTeams = await this.parseRequestUserTeams(user)

    this.logger.debug({
      userTeams,
      user,
      message: `Reduced teams for user`,
    })

    const data = await this.repository.findByIDWithTeamConstraint(id, userTeams)

    return data
  }

  async getOneByIdIfIsSelf(id: UserDTO['id'], user: UserDTO): Promise<User | null> {
    const data = await this.repository.findByIDWithSelfConstraint(id, user.id)

    return data
  }

  async getUserFromSubjectWithTeamRelation(authzSub: UserDTO['authzSub']): Promise<User> {
    return this.repository.findOne({ authzSub }, { relations: ['teams'] })
  }

  async parseRequestUserCompanies(user: UserDTO): Promise<Array<CompanyDTO['id']>> {
    const userTeams = await user.teams
    const userCompanies = uniq(userTeams.map((team) => team.companyId))

    return userCompanies
  }

  async parseRequestUserTeams(user: UserDTO): Promise<Array<TeamDTO['id']>> {
    const userTeams = await user.teams
    const userTeamIDs = uniq(userTeams.map((team) => team.id))

    return userTeamIDs
  }
}

export default DomainUserService
