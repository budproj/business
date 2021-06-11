import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'
import { ConstraintType } from '@core/enums/contrain-type.enum'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResult } from '../key-result.orm-entity'

import { KeyResultComment } from './key-result-comment.orm-entity'

@EntityRepository(KeyResultComment)
export class KeyResultCommentRepository extends CoreEntityRepository<KeyResultComment> {
  public entityName = KeyResultComment.name

  public async getFromObjective(objectiveID: string): Promise<KeyResultComment[]> {
    return this.createQueryBuilder()
      .leftJoinAndSelect(`${KeyResultComment.name}.keyResult`, `${KeyResult.name}`)
      .where(`${KeyResult.name}.objectiveId = :objectiveID`, { objectiveID })
      .getMany()
  }

  protected setupTeamQuery(query: SelectQueryBuilder<KeyResultComment>) {
    return query.leftJoinAndSelect(`${KeyResultComment.name}.keyResult`, KeyResult.name)
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

    return query[constraintMethodName](`${KeyResultComment.name}.userId = :userID`, {
      userID: user.id,
    })
  }
}
