import { Injectable } from '@nestjs/common'

import { KeyResultDTO } from 'domain/key-result/dto'
import { ObjectiveDTO } from 'domain/objective/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { KeyResult } from './entities'
import KeyResultRepository from './repository'

@Injectable()
class KeyResultService {
  constructor(private readonly repository: KeyResultRepository) {}

  async getOneById(id: KeyResultDTO['id']): Promise<KeyResult> {
    return this.repository.findOne({ where: { id } })
  }

  async getOwnedBy(ownerId: UserDTO['id']): Promise<KeyResult[]> {
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

    const query = this.repository.createQueryBuilder()
    const filteredQuery = query.where('id IN (:...ids)', { ids })
    const orderedQuery = filteredQuery.orderBy(rankSortColumn)

    return orderedQuery.getMany()
  }
}

export default KeyResultService
