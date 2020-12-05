import { Injectable } from '@nestjs/common'
import { FindConditions } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { CycleDTO } from 'domain/cycle/dto'
import DomainEntityService from 'domain/service'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { Cycle } from './entities'
import DomainCycleRepository from './repository'

@Injectable()
class DomainCycleService extends DomainEntityService<Cycle, CycleDTO> {
  constructor(public readonly repository: DomainCycleRepository) {
    super(repository, DomainCycleService.name)
  }

  async canUserReadForCompany(
    selector: FindConditions<Cycle>,
    userCompanies: Array<CompanyDTO['id']>,
  ): Promise<boolean> {
    const selectedCycles = await this.repository.find(selector)
    const relatedCompanyIDs = selectedCycles.map((cycle) => cycle.companyId)
    const canUserRead = relatedCompanyIDs.every((companyID) => userCompanies.includes(companyID))

    return canUserRead
  }

  async canUserReadForTeam(
    selector: FindConditions<Cycle>,
    userTeams: Array<TeamDTO['id']>,
  ): Promise<boolean> {
    const relatedTeams = await this.repository.findRelatedTeams(selector)
    const canUserRead = relatedTeams.every((team) => userTeams.includes(team.id))

    return canUserRead
  }

  async canUserReadForSelf(selector: FindConditions<Cycle>, user: UserDTO): Promise<boolean> {
    const relatedOwners = await this.repository.findRelatedOwners(selector)
    const canUserRead = relatedOwners.every((owner) => owner.id === user.id)

    return canUserRead
  }

  async getFromCompany(companyId: CompanyDTO['id']): Promise<Cycle[]> {
    return this.repository.find({ companyId })
  }
}

export default DomainCycleService
