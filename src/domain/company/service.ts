import { Injectable } from '@nestjs/common'
import { flatten, isEqual, uniqWith } from 'lodash'

import { CompanyDTO } from 'domain/company/dto'
import { ConfidenceReport } from 'domain/key-result/report/confidence/entities'
import { ProgressReport } from 'domain/key-result/report/progress/entities'
import DomainKeyResultService from 'domain/key-result/service'
import DomainEntityService from 'domain/service'
import DomainTeamService from 'domain/team/service'
import { UserDTO } from 'domain/user/dto'

import { Company } from './entities'
import DomainCompanyRepository from './repository'

@Injectable()
class DomainCompanyService extends DomainEntityService<Company, CompanyDTO> {
  constructor(
    public readonly repository: DomainCompanyRepository,
    private readonly keyResultService: DomainKeyResultService,
    private readonly teamService: DomainTeamService,
  ) {
    super(repository, DomainCompanyService.name)
  }

  async getFromOwner(ownerId: UserDTO['id']): Promise<Company[]> {
    return this.repository.find({ ownerId })
  }

  async getCurrentProgress(companyId: CompanyDTO['id']): Promise<ProgressReport['valueNew']> {
    const childTeams = await this.teamService.getFromCompany(companyId, ['id'])
    const childTeamIds = childTeams.map((childTeam) => childTeam.id)

    const keyResults = await this.keyResultService.getFromTeam(childTeamIds)
    if (!keyResults) return

    const companyCurrentProgress = this.keyResultService.calculateAverageCurrentProgressFromList(
      keyResults,
    )

    return companyCurrentProgress
  }

  async getCurrentConfidence(companyId: CompanyDTO['id']): Promise<ConfidenceReport['valueNew']> {
    const childTeams = await this.teamService.getFromCompany(companyId, ['id'])
    const childTeamIds = childTeams.map((childTeam) => childTeam.id)

    const keyResults = await this.keyResultService.getFromTeam(childTeamIds)
    if (!keyResults) return

    const companyCurrentConfidence = this.keyResultService.calculateAverageCurrentConfidenceFromList(
      keyResults,
    )

    return companyCurrentConfidence
  }

  async getUsersInCompany(companyId: CompanyDTO['id']): Promise<UserDTO[]> {
    const childTeams = await this.teamService.getFromCompany(companyId, ['id'])
    const childTeamsUsers = await Promise.all(
      childTeams.map(async (team) => this.teamService.getUsersInTeam(team.id)),
    )

    const companyUsers = flatten(childTeamsUsers)
    const uniqCompanyUsers = uniqWith(companyUsers, isEqual)

    return uniqCompanyUsers
  }

  async getFromIDs(companyIDs: Array<CompanyDTO['id']>, options?: { limit?: number }) {
    const companies = this.repository.selectManyInIDs(companyIDs, options)

    return companies
  }
}

export default DomainCompanyService
