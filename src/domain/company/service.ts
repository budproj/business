import { Injectable } from '@nestjs/common'
import { FindConditions } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import DomainEntityService from 'domain/service'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { Company } from './entities'
import DomainCompanyRepository from './repository'

@Injectable()
class DomainCompanyService extends DomainEntityService<Company, CompanyDTO> {
  constructor(public readonly repository: DomainCompanyRepository) {
    super(repository, DomainCompanyService.name)
  }

  async canUserReadForCompany(
    selector: FindConditions<Company>,
    userCompanies: Array<CompanyDTO['id']>,
  ): Promise<boolean> {
    const selectedCompanies = await this.repository.find(selector)
    const canUserRead = selectedCompanies.every((company) => userCompanies.includes(company.id))

    return canUserRead
  }

  async canUserReadForTeam(
    selector: FindConditions<Company>,
    userTeams: Array<TeamDTO['id']>,
  ): Promise<boolean> {
    const relatedTeams = await this.repository.findRelatedTeams(selector)
    const canUserRead = relatedTeams.every((team) => userTeams.includes(team.id))

    return canUserRead
  }

  async canUserReadForSelf(selector: FindConditions<Company>, user: UserDTO): Promise<boolean> {
    const selectedCompanies = await this.repository.find(selector)
    const canUserRead = selectedCompanies.every((company) => company.ownerId === user.id)

    return canUserRead
  }

  async getFromOwner(ownerId: UserDTO['id']): Promise<Company[]> {
    return this.repository.find({ ownerId })
  }
}

export default DomainCompanyService
