import { EntityRepository, LessThanOrEqual, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { DOMAIN_QUERY_ORDER } from 'src/domain/constants'
import { CONSTRAINT_TYPE, DomainEntityRepository } from 'src/domain/entity'
import {
  KeyResultCheckInFilters,
  KeyResultCheckInQueryOptions,
} from 'src/domain/key-result/check-in/types'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { KeyResult } from 'src/domain/key-result/entities'
import { Objective } from 'src/domain/objective/entities'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResultCheckIn } from './entities'

export interface DomainKeyResultCheckInRepositoryInterface {
  getLatestFromDateForKeyResult: (
    date: Date,
    keyResult: KeyResultDTO,
  ) => Promise<KeyResultCheckIn | null>
  findWithFilters: (
    filters: KeyResultCheckInFilters,
    options?: KeyResultCheckInQueryOptions,
  ) => Promise<KeyResultCheckIn[]>
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
      createdAt: DOMAIN_QUERY_ORDER.DESC,
    }

    const checkIn = await this.findOne({
      where,
      order,
    })

    return checkIn
  }

  public async findWithFilters(
    filters: KeyResultCheckInFilters,
    options: KeyResultCheckInQueryOptions,
  ) {
    const { userIDs, cycleID } = filters
    const query = this.createQueryBuilder()
      .where(`${KeyResultCheckIn.name}.userId in (:...userIDs)`, { userIDs })
      .leftJoinAndSelect(`${KeyResultCheckIn.name}.keyResult`, `${KeyResult.name}`)
      .leftJoinAndSelect(`${KeyResult.name}.objective`, `${Objective.name}`)
      .andWhere(cycleID ? `${Objective.name}.cycleId = :cycleID` : '1=1', { cycleID })
      .limit(options.limit ?? 0)

    const orderedQuery =
      options.orderBy && options.orderBy.length > 0
        ? options.orderBy.reduce(
            (query, [field, direction]) =>
              query.addOrderBy(`${KeyResultCheckIn.name}.${field}`, direction),
            query,
          )
        : query

    return orderedQuery.getMany()
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
