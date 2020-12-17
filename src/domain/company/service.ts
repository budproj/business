import { Injectable } from '@nestjs/common'
import { sum } from 'lodash'

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

    const currentProgressList = await Promise.all(
      keyResults.map(async ({ id }) => this.keyResultService.getCurrentProgress(id)),
    )
    const companyCurrentProgress = sum(currentProgressList) / currentProgressList.length

    return companyCurrentProgress
  }

  async getCurrentConfidence(companyId: CompanyDTO['id']): Promise<ConfidenceReport['valueNew']> {
    const childTeams = await this.teamService.getFromCompany(companyId, ['id'])
    const childTeamIds = childTeams.map((childTeam) => childTeam.id)

    const keyResults = await this.keyResultService.getFromTeam(childTeamIds)
    if (!keyResults) return

    const currentConfidenceList = await Promise.all(
      keyResults.map(async ({ id }) => this.keyResultService.getCurrentConfidence(id)),
    )
    const companyCurrentConfidence = sum(currentConfidenceList) / currentConfidenceList.length

    return companyCurrentConfidence
  }
}

export default DomainCompanyService
