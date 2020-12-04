import { Injectable } from '@nestjs/common'

import { KeyResultDTO } from 'domain/key-result/dto'
import { ObjectiveDTO } from 'domain/objective/dto'
import DomainService from 'domain/service'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { KeyResult } from './entities'
import DomainKeyResultReportService from './report/service'
import DomainKeyResultRepository from './repository'

@Injectable()
class DomainKeyResultService extends DomainService<KeyResult, KeyResultDTO> {
  constructor(
    public readonly report: DomainKeyResultReportService,
    public readonly repository: DomainKeyResultRepository,
  ) {
    super(repository, DomainKeyResultService.name)
  }

  async getOneById(id: KeyResultDTO['id']): Promise<KeyResult> {
    return this.repository.findOne({ id })
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

  async getOneByIdIfUserIsInCompany(
    id: KeyResultDTO['id'],
    user: UserDTO,
  ): Promise<KeyResult | null> {
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

export default DomainKeyResultService
