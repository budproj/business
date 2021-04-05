import { EntityRepository, LessThanOrEqual, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { DOMAIN_SORTING } from 'src/domain/constants'
import { CONSTRAINT_TYPE, DomainEntityRepository } from 'src/domain/entity'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { KeyResult } from 'src/domain/key-result/entities'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResultCheckIn } from './entities'

export interface DomainKeyResultCheckInRepositoryInterface {
  getLatestFromDateForKeyResult: (
    date: Date,
    keyResult: KeyResultDTO,
  ) => Promise<KeyResultCheckIn | null>
}

@EntityRepository(KeyResultCheckIn)
class DomainKeyResultCheckInRepository
  extends DomainEntityRepository<KeyResultCheckIn>
  implements DomainKeyResultCheckInRepositoryInterface {
  public async getLatestFromDateForKeyResult(date: Date, keyResult: KeyResultDTO) {
    const isoDate = date.toISOString()

    const where = {
      keyResultId: keyResult.id,
      createdAt: LessThanOrEqual(isoDate),
    }
    const order = {
      createdAt: DOMAIN_SORTING.DESC,
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
