import { Injectable } from '@nestjs/common'

import DomainService from 'domain/service'
import { UserDTO } from 'domain/user/dto'

import { User } from './entities'
import DomainUserRepository from './repository'
import DomainUserViewService from './view/service'

@Injectable()
class DomainUserService extends DomainService<User, UserDTO> {
  constructor(
    public readonly view: DomainUserViewService,
    public readonly repository: DomainUserRepository,
  ) {
    super(repository, DomainUserService.name)
  }

  async getOneById(id: UserDTO['id']): Promise<User> {
    return this.repository.findOne({ id })
  }

  async getOneByIdIfUserShareCompany(id: UserDTO['id'], user: UserDTO): Promise<User | null> {
    const userCompanies = await this.parseUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const data = await this.repository.findByIDWithCompanyConstraint(id, userCompanies)

    return data
  }

  async getOneByIdIfUserShareTeam(id: UserDTO['id'], user: UserDTO): Promise<User | null> {
    const userTeams = await this.parseUserTeams(user)

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
}

export default DomainUserService
