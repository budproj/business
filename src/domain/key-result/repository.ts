import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CONSTRAINT_TYPE, DomainEntityRepository } from 'src/domain/entity'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { KeyResultFilters } from 'src/domain/key-result/types'
import { Objective } from 'src/domain/objective/entities'
import { TeamDTO } from 'src/domain/team/dto'
import { Team } from 'src/domain/team/entities'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResult } from './entities'

export interface DomainKeyResultRepositoryInterface {
  buildRankSortColumn: (rank: Array<KeyResultDTO['id']>) => string
  findByIdsRanked: (ids: Array<KeyResultDTO['id']>, rank: string) => Promise<KeyResult[]>
  getInitialValueForKeyResult: (keyResult: KeyResultDTO) => Promise<KeyResult['initialValue']>
  findWithFilters: (filters: KeyResultFilters) => Promise<KeyResult[]>
}

@EntityRepository(KeyResult)
class DomainKeyResultRepository
  extends DomainEntityRepository<KeyResult>
  implements DomainKeyResultRepositoryInterface {
  public buildRankSortColumn(rank: Array<KeyResultDTO['id']>): string {
    if (rank.length === 0) return ''

    const prefix = '(CASE'
    const parts = rank.map(
      (keyResultID: KeyResultDTO['id'], index: number) =>
        `WHEN ${KeyResult.name}.id='${keyResultID}' THEN ${index}`,
    )
    const suffix = 'ELSE null END)'

    const rankSortColumn = [prefix, ...parts, suffix].join(' ')

    return rankSortColumn
  }

  public async findByIdsRanked(ids: Array<KeyResultDTO['id']>, rank: string) {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where(`${KeyResult.name}.id IN (:...ids)`, { ids })
    const orderedQuery = filteredQuery.orderBy(rank)

    return orderedQuery.getMany()
  }

  public async getInitialValueForKeyResult(keyResult: KeyResultDTO) {
    const where = {
      id: keyResult.id,
    }
    const select: Array<keyof KeyResult> = ['initialValue']

    const selectedKeyResult = await this.findOne({
      where,
      select,
    })

    return selectedKeyResult.initialValue
  }

  public async findWithFilters(filters: KeyResultFilters) {
    const { teamIDs, cycleID } = filters
    const query = this.createQueryBuilder()
      .where(`${KeyResult.name}.teamId in (:...teamIDs)`, { teamIDs })
      .leftJoinAndSelect(`${KeyResult.name}.objective`, `${Objective.name}`)
      .andWhere(cycleID ? `${Objective.name}.cycleId = :cycleID` : '1=1', { cycleID })

    return query.getMany()
  }

  protected setupTeamQuery(query: SelectQueryBuilder<KeyResult>) {
    return query.leftJoinAndSelect(`${KeyResult.name}.team`, Team.name)
  }

  protected addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: Array<TeamDTO['id']>,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${Team.name}.id IN (:...allowedTeams)`, {
      allowedTeams,
    })
  }

  protected addOwnsWhereExpression(
    query: WhereExpression,
    user: UserDTO,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${KeyResult.name}.ownerId = :userID`, {
      userID: user.id,
    })
  }
}

export default DomainKeyResultRepository
