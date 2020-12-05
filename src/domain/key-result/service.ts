import { Injectable } from '@nestjs/common'
import { FindConditions } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { KeyResultDTO } from 'domain/key-result/dto'
import { ObjectiveDTO } from 'domain/objective/dto'
import DomainEntityService from 'domain/service'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { KeyResult } from './entities'
import DomainKeyResultReportService from './report/service'
import DomainKeyResultRepository from './repository'

@Injectable()
class DomainKeyResultService extends DomainEntityService<KeyResult, KeyResultDTO> {
  constructor(
    public readonly report: DomainKeyResultReportService,
    public readonly repository: DomainKeyResultRepository,
  ) {
    super(repository, DomainKeyResultService.name)
  }

  async canUserReadForCompany(
    selector: FindConditions<KeyResult>,
    userCompanies: Array<CompanyDTO['id']>,
  ): Promise<boolean> {
    const relatedTeams = await this.repository.findRelatedTeams(selector)
    const relatedCompanyIDs = relatedTeams.map((team) => team.companyId)
    const canUserRead = relatedCompanyIDs.every((companyID) => userCompanies.includes(companyID))

    return canUserRead
  }

  async canUserReadForTeam(
    selector: FindConditions<KeyResult>,
    userTeams: Array<TeamDTO['id']>,
  ): Promise<boolean> {
    const relatedTeams = await this.repository.findRelatedTeams(selector)
    const canUserRead = relatedTeams.every((team) => userTeams.includes(team.id))

    return canUserRead
  }

  async canUserReadForSelf(selector: FindConditions<KeyResult>, user: UserDTO): Promise<boolean> {
    const selectedKeyResults = await this.repository.find(selector)
    const canUserRead = selectedKeyResults.every((keyResult) => keyResult.ownerId === user.id)

    return canUserRead
  }

  async getFromOwner(ownerId: UserDTO['id']): Promise<KeyResult[]> {
    return this.repository.find({ ownerId })
  }

  async getFromObjective(objectiveId: ObjectiveDTO['id']): Promise<KeyResult[]> {
    return this.repository.find({ objectiveId })
  }

  async getFromTeam(teamId: TeamDTO['id']): Promise<KeyResult[]> {
    return this.repository.find({ teamId })
  }

  async getManyByIdsPreservingOrderIfUserIsInCompany(
    ids: Array<KeyResultDTO['id']>,
    user: UserDTO,
  ): Promise<KeyResult[]> {
    const userCompanies = await this.parseUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const rankSortColumn = this.repository.buildRankSortColumn(ids)
    const data = this.repository.findByIdsRankedWithCompanyConstraint(
      ids,
      rankSortColumn,
      userCompanies,
    )

    return data
  }
}

export default DomainKeyResultService
