import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { KeyResult } from 'src/domain/key-result/entities'
import DomainEntityRepository, { CONSTRAINT_TYPE } from 'src/domain/repository'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { ConfidenceReport } from './entities'

@EntityRepository(ConfidenceReport)
class DomainConfidenceReportRepository extends DomainEntityRepository<ConfidenceReport> {
  setupTeamQuery(query: SelectQueryBuilder<ConfidenceReport>) {
    return query.leftJoinAndSelect(`${ConfidenceReport.name}.keyResult`, KeyResult.name)
  }

  addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: Array<TeamDTO['id']>,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${KeyResult.name}.teamId IN (:...allowedTeams)`, {
      allowedTeams,
    })
  }

  addOwnsWhereExpression(
    query: WhereExpression,
    user: UserDTO,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${ConfidenceReport.name}.userId = :userID`, {
      userID: user.id,
    })
  }

  async selectManyInUserIDs(userIDs: Array<UserDTO['id']>) {
    const query = this.createQueryBuilder().where('user_id IN(:...userIDs)', { userIDs })

    return query.getMany()
  }
}

export default DomainConfidenceReportRepository
