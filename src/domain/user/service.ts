import { Injectable, Logger } from '@nestjs/common'
import { uniq } from 'lodash'

import { CompanyDTO } from 'domain/company/dto'
import { UserDTO } from 'domain/user/dto'

import { User } from './entities'
import UserRepository from './repository'
import UserViewService from './view/service'

@Injectable()
class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(public readonly view: UserViewService, private readonly repository: UserRepository) {}

  async getOneById(id: UserDTO['id']): Promise<User> {
    return this.repository.findOne({ id })
  }

  async getUserFromSubjectWithTeamRelation(authzSub: UserDTO['authzSub']): Promise<User> {
    return this.repository.findOne({ authzSub }, { relations: ['teams'] })
  }

  async parseRequestUserCompanies(user: UserDTO): Promise<Array<CompanyDTO['id']>> {
    const userTeams = await user.teams
    const userCompanies = uniq(userTeams.map((team) => team.companyId))

    return userCompanies
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
}

export default UserService
