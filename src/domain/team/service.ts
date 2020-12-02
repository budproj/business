import { Injectable, Logger } from '@nestjs/common'

import { CompanyDTO } from 'domain/company/dto'
import { UserDTO } from 'domain/user/dto'
import DomainUserService from 'domain/user/service'

import { TeamDTO } from './dto'
import { Team } from './entities'
import DomainTeamRepository from './repository'

@Injectable()
class DomainTeamService {
  private readonly logger = new Logger(DomainTeamService.name)

  constructor(
    private readonly repository: DomainTeamRepository,
    private readonly userService: DomainUserService,
  ) {}

  async getAll(): Promise<Team[]> {
    return this.repository.find()
  }

  async getOneById(id: Team['id']): Promise<Team> {
    return this.repository.findOne({ id })
  }

  async getFromCompany(companyId: CompanyDTO['id']): Promise<Team[]> {
    return this.repository.find({ companyId })
  }

  async getOneByIdIfUserShareCompany(id: TeamDTO['id'], user: UserDTO): Promise<Team | null> {
    const userCompanies = await this.userService.parseRequestUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const data = await this.repository.findByIDWithCompanyConstraint(id, userCompanies)

    return data
  }
}

export default DomainTeamService
