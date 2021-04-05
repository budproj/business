import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CONSTRAINT_TYPE, DomainEntityRepository } from 'src/domain/entity'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { KeyResult } from 'src/domain/key-result/entities'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResultComment } from './entities'

export interface DomainKeyResultCommentRepositoryInterface {
  getLatestFromDateForKeyResult: (
    date: Date,
    keyResult: KeyResultDTO,
  ) => Promise<KeyResultComment | null>
}

@EntityRepository(KeyResultComment)
class DomainKeyResultCommentRepository extends DomainEntityRepository<KeyResultComment> {
  protected setupTeamQuery(query: SelectQueryBuilder<KeyResultComment>) {
    return query.leftJoinAndSelect(`${KeyResultComment.name}.keyResult`, KeyResult.name)
  }

  protected addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: Array<TeamDTO['id']>,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${KeyResult.name}.teamId IN (:...allowedTeams)`, {
      allowedTeams,
    })
  }

  protected addOwnsWhereExpression(
    query: WhereExpression,
    user: UserDTO,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${KeyResultComment.name}.userId = :userID`, {
      userID: user.id,
    })
  }
}

export default DomainKeyResultCommentRepository
