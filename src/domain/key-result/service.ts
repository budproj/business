import { Injectable, Logger } from '@nestjs/common'

import { KeyResultDTO } from 'domain/key-result/dto'
import { ObjectiveDTO } from 'domain/objective/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'
import UserService from 'domain/user/service'

import { KeyResult } from './entities'
import KeyResultRepository from './repository'

@Injectable()
class KeyResultService {
  private readonly logger = new Logger(KeyResultService.name)

  constructor(
    private readonly repository: KeyResultRepository,
    private readonly userService: UserService,
  ) {}

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

  async getManyByIdsPreservingOrder(ids: Array<KeyResultDTO['id']>): Promise<KeyResult[]> {
    const rankSortColumn = this.repository.buildRankSortColumn(ids)
    const data = this.repository.findByIdsRanked(ids, rankSortColumn)

    return data
  }

  async getOneByIdIfUserIsInCompany(
    id: KeyResultDTO['id'],
    user: UserDTO,
  ): Promise<KeyResult | null> {
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

export default KeyResultService
