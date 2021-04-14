import { EntityRepository, LessThanOrEqual, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'
import { ConstraintType } from '@core/enums/contrain-type.enum'
import { Sorting } from '@core/enums/sorting'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultInterface } from '../interfaces/key-result.interface'
import { KeyResult } from '../key-result.orm-entity'

import { KeyResultCheckIn } from './key-result-check-in.orm-entity'

@EntityRepository(KeyResultCheckIn)
export class KeyResultCheckInRepository extends CoreEntityRepository<KeyResultCheckIn> {
  public async getLatestFromDateForKeyResult(date: Date, keyResult: KeyResultInterface) {
    const isoDate = date.toISOString()

    const where = {
      keyResultId: keyResult.id,
      createdAt: LessThanOrEqual(isoDate),
    }
    const order = {
      createdAt: Sorting.DESC,
    }

    const checkIn = await this.findOne({
      where,
      order,
    })

    return checkIn
  }

  protected setupTeamQuery(query: SelectQueryBuilder<KeyResultCheckIn>) {
    return query.leftJoinAndSelect(`${KeyResultCheckIn.name}.keyResult`, KeyResult.name)
  }

  protected addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: Array<TeamInterface['id']>,
    constraintType: ConstraintType = ConstraintType.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${KeyResult.name}.teamId IN (:...allowedTeams)`, {
      allowedTeams,
    })
  }

  protected addOwnsWhereExpression(
    query: WhereExpression,
    user: UserInterface,
    constraintType: ConstraintType = ConstraintType.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${KeyResultCheckIn.name}.userId = :userID`, {
      userID: user.id,
    })
  }
}
