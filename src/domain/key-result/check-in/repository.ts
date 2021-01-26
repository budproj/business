import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CONSTRAINT_TYPE, DomainEntityRepository } from 'src/domain/entity'
import { KeyResult } from 'src/domain/key-result/entities'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResultCheckIn } from './entities'

@EntityRepository(KeyResultCheckIn)
class DomainKeyResultCheckInRepository extends DomainEntityRepository<KeyResultCheckIn> {
  protected setupTeamQuery(query: SelectQueryBuilder<KeyResultCheckIn>) {
    return query.leftJoinAndSelect(`${KeyResultCheckIn.name}.keyResult`, KeyResult.name)
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

    return query[constraintMethodName](`${KeyResultCheckIn.name}.userId = :userID`, {
      userID: user.id,
    })
  }
}

export default DomainKeyResultCheckInRepository
