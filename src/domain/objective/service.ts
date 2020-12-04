import { Injectable } from '@nestjs/common'

import { CycleDTO } from 'domain/cycle/dto'
import { ObjectiveDTO } from 'domain/objective/dto'
import DomainService from 'domain/service'
import { UserDTO } from 'domain/user/dto'

import { Objective } from './entities'
import DomainObjectiveRepository from './repository'

@Injectable()
class DomainObjectiveService extends DomainService<Objective, ObjectiveDTO> {
  constructor(public readonly repository: DomainObjectiveRepository) {
    super(repository, DomainObjectiveService.name)
  }

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
    const userCompanies = await this.parseUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const data = await this.repository.findByIDWithCompanyConstraint(id, userCompanies)

    return data
  }
}

export default DomainObjectiveService
