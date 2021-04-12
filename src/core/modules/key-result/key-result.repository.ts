import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'
import { ConstraintType } from '@core/enums/contrain-type.enum'
import { TeamInterface } from '@core/modules/team/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultInterface } from './interfaces/key-result.interface'
import { KeyResult } from './key-result.orm-entity'

@EntityRepository(KeyResult)
export class KeyResultRepository extends CoreEntityRepository<KeyResult> {
  public buildRankSortColumn(rank: Array<KeyResultInterface['id']>): string {
    if (rank.length === 0) return ''

    const prefix = '(CASE'
    const parts = rank.map(
      (keyResultID: KeyResultInterface['id'], index: number) =>
        `WHEN ${KeyResult.name}.id='${keyResultID}' THEN ${index}`,
    )
    const suffix = 'ELSE null END)'

    const rankSortColumn = [prefix, ...parts, suffix].join(' ')

    return rankSortColumn
  }

  public async findByIdsRanked(ids: Array<KeyResultInterface['id']>, rank: string) {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where(`${KeyResult.name}.id IN (:...ids)`, { ids })
    const orderedQuery = filteredQuery.orderBy(rank)

    return orderedQuery.getMany()
  }

  public async getInitialValueForKeyResult(keyResult: KeyResultInterface) {
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

  protected setupTeamQuery(query: SelectQueryBuilder<KeyResult>) {
    return query.leftJoinAndSelect(`${KeyResult.name}.team`, Team.name)
  }

  protected addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: Array<TeamInterface['id']>,
    constraintType: ConstraintType = ConstraintType.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${Team.name}.id IN (:...allowedTeams)`, {
      allowedTeams,
    })
  }

  protected addOwnsWhereExpression(
    query: WhereExpression,
    user: UserInterface,
    constraintType: ConstraintType = ConstraintType.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${KeyResult.name}.ownerId = :userID`, {
      userID: user.id,
    })
  }
}
