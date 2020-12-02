import { Injectable, Logger } from '@nestjs/common'

import { CompanyDTO } from 'domain/company/dto'
import { CycleDTO } from 'domain/cycle/dto'
import { UserDTO } from 'domain/user/dto'
import DomainUserService from 'domain/user/service'

import { Cycle } from './entities'
import DomainCycleRepository from './repository'

@Injectable()
class DomainCycleService {
  private readonly logger = new Logger(DomainCycleService.name)

  constructor(
    private readonly repository: DomainCycleRepository,
    private readonly userService: DomainUserService,
  ) {}

  async getOneById(id: CycleDTO['id']): Promise<Cycle> {
    return this.repository.findOne({ id })
  }

  async getFromCompany(companyId: CompanyDTO['id']): Promise<Cycle[]> {
    return this.repository.find({ companyId })
  }

  async getOneByIdIfUserIsInCompany(id: CycleDTO['id'], user: UserDTO): Promise<Cycle | null> {
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

export default DomainCycleService
