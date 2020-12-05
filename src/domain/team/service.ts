import { Injectable } from '@nestjs/common'
import { FindConditions } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import DomainEntityService from 'domain/service'
import { UserDTO } from 'domain/user/dto'

import { TeamDTO } from './dto'
import { Team } from './entities'
import DomainTeamRepository from './repository'

@Injectable()
class DomainTeamService extends DomainEntityService<Team, TeamDTO> {
  constructor(public readonly repository: DomainTeamRepository) {
    super(repository, DomainTeamService.name)
  }

  async canUserReadForCompany(
    selector: FindConditions<Team>,
    userCompanies: Array<CompanyDTO['id']>,
  ): Promise<boolean> {
    const selectedTeams = await this.repository.find(selector)
    const relatedCompanies = selectedTeams.map((team) => team.companyId)
    const canUserRead = relatedCompanies.every((company) => userCompanies.includes(company))

    return canUserRead
  }

  async canUserReadForTeam(
    selector: FindConditions<Team>,
    userTeams: Array<TeamDTO['id']>,
  ): Promise<boolean> {
    const relatedTeams = await this.repository.find(selector)
    const relatedTeamIDs = relatedTeams.map((team) => team.id)
    const canUserRead = relatedTeamIDs.every((teamID) => userTeams.includes(teamID))

    return canUserRead
  }

  async canUserReadForSelf(selector: FindConditions<Team>, user: UserDTO): Promise<boolean> {
    const selectedTeams = await this.repository.find(selector)
    const canUserRead = selectedTeams.every((team) => team.ownerId === user.id)

    return canUserRead
  }

  async getFromCompany(companyId: CompanyDTO['id']): Promise<Team[]> {
    return this.repository.find({ companyId })
  }

  async getFromOwner(ownerId: UserDTO['id']): Promise<Team[]> {
    return this.repository.find({ ownerId })
  }
}

export default DomainTeamService
