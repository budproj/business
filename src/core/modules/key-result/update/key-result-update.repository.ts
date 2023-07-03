import { EntityRepository, LessThanOrEqual, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'
import { ConstraintType } from '@core/enums/contrain-type.enum'
import { Sorting } from '@core/enums/sorting'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResult } from '../key-result.orm-entity'

import { KeyResultUpdate } from './key-result-update.orm-entity'

@EntityRepository(KeyResultUpdate)
export class KeyResultUpdateRepository extends CoreEntityRepository<KeyResultUpdate> {
  public entityName = KeyResultUpdate.name

  public async getLatestFromDateForKeyResult(date: Date, keyResultId: string) {
    const isoDate = date.toISOString()

    const where = {
      keyResultId,
      createdAt: LessThanOrEqual(isoDate),
    }
    const order = {
      createdAt: Sorting.DESC,
    }

    return this.findOne({
      where,
      order,
    })
  }

  public async getFromObjective(objectiveID: string): Promise<KeyResultUpdate[]> {
    return this.createQueryBuilder()
      .leftJoinAndSelect(`${KeyResultUpdate.name}.keyResult`, `${KeyResult.name}`)
      .where(`${KeyResult.name}.objectiveId = :objectiveID`, { objectiveID })
      .getMany()
  }

  protected setupTeamQuery(query: SelectQueryBuilder<KeyResultUpdate>) {
    return query.leftJoinAndSelect(`${KeyResultUpdate.name}.keyResult`, KeyResult.name)
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

    return query[constraintMethodName](`${KeyResultUpdate.name}.userId = :userID`, {
      userID: user.id,
    })
  }
}
