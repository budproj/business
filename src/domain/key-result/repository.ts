import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import { KeyResultDTO } from 'src/domain/key-result/dto'
import DomainEntityRepository, { CONSTRAINT_TYPE } from 'src/domain/repository'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResult } from './entities'

@EntityRepository(KeyResult)
class DomainKeyResultRepository extends DomainEntityRepository<KeyResult> {
  constraintQueryToTeam(
    allowedTeams: Array<TeamDTO['id']>,
    user: UserDTO,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.AND,
  ) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<KeyResult>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const ownsConstrainedQuery = this.constraintQueryToOwns(user, CONSTRAINT_TYPE.OR)(baseQuery)
      const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(
        constraintType,
      )

      const constrainedQuery = ownsConstrainedQuery
        .leftJoinAndSelect(`${KeyResult.name}.team`, 'team')
        [constraintMethodName]('team.id IN (:...allowedTeams)', { allowedTeams })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToOwns(user: UserDTO, constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.AND) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<KeyResult>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(
        constraintType,
      )

      const constrainedQuery = baseQuery[constraintMethodName](
        `${KeyResult.name}.ownerId = :userID`,
        {
          userID: user.id,
        },
      )

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  buildRankSortColumn(rank: Array<KeyResultDTO['id']>): string {
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

  async findByIdsRanked(ids: Array<KeyResultDTO['id']>, rank: string): Promise<KeyResult[]> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where(`${KeyResult.name}.id IN (:...ids)`, { ids })
    const orderedQuery = filteredQuery.orderBy(rank)

    return orderedQuery.getMany()
  }
}

export default DomainKeyResultRepository
