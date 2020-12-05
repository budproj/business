import { Injectable } from '@nestjs/common'
import { FindConditions } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import DomainEntityService from 'domain/service'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { KeyResultViewDTO } from './dto'
import { KeyResultView } from './entities'
import DomainKeyResultViewRepository from './repository'

@Injectable()
class DomainKeyResultViewService extends DomainEntityService<KeyResultView, KeyResultViewDTO> {
  constructor(public readonly repository: DomainKeyResultViewRepository) {
    super(repository, DomainKeyResultViewService.name)
  }

  async canUserReadForCompany(
    selector: FindConditions<KeyResultView>,
    userCompanies: Array<CompanyDTO['id']>,
  ): Promise<boolean> {
    const relatedTeams = await this.repository.findRelatedTeams(selector)
    const relatedCompanies = relatedTeams.map((team) => team.companyId)
    const canUserRead = relatedCompanies.every((company) => userCompanies.includes(company))

    return canUserRead
  }

  async canUserReadForTeam(
    selector: FindConditions<KeyResultView>,
    userTeams: Array<TeamDTO['id']>,
  ): Promise<boolean> {
    const relatedTeams = await this.repository.findRelatedTeams(selector)
    const relatedTeamIDs = relatedTeams.map((team) => team.id)
    const canUserRead = relatedTeamIDs.every((team) => userTeams.includes(team))

    return canUserRead
  }

  async canUserReadForSelf(
    selector: FindConditions<KeyResultView>,
    user: UserDTO,
  ): Promise<boolean> {
    const selectedView = await this.repository.findOne(selector)

    return selectedView.userId === user.id
  }

  async canUserUpdateForCompany(
    selector: FindConditions<KeyResultView>,
    userCompanies: Array<CompanyDTO['id']>,
  ): Promise<boolean> {
    return this.canUserReadForCompany(selector, userCompanies)
  }

  async canUserUpdateForTeam(
    selector: FindConditions<KeyResultView>,
    userTeams: Array<TeamDTO['id']>,
  ): Promise<boolean> {
    return this.canUserReadForTeam(selector, userTeams)
  }

  async canUserUpdateForSelf(
    selector: FindConditions<KeyResultView>,
    user: UserDTO,
  ): Promise<boolean> {
    return this.canUserReadForSelf(selector, user)
  }
}

export default DomainKeyResultViewService
