import { Injectable, Logger } from '@nestjs/common'

import { CycleDTO } from 'domain/cycle/dto'
import { ObjectiveDTO } from 'domain/objective/dto'
import { UserDTO } from 'domain/user/dto'
import UserService from 'domain/user/service'

import { Objective } from './entities'
import ObjectiveRepository from './repository'

@Injectable()
class ObjectiveService {
  private readonly logger = new Logger(ObjectiveService.name)

  constructor(
    private readonly repository: ObjectiveRepository,
    private readonly userService: UserService,
  ) {}

  async getOneById(id: ObjectiveDTO['id']): Promise<Objective> {
    return this.repository.findOne({ id })
  }

  async getFromCycle(cycleId: CycleDTO['id']): Promise<Objective[]> {
    return this.repository.find({ cycleId })
  }

  async getOneByIdIfUserIsInCompany(
    id: ObjectiveDTO['id'],
    user: UserDTO,
  ): Promise<Objective | null> {
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

export default ObjectiveService
