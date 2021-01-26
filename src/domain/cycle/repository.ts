import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CONSTRAINT_TYPE, DomainEntityRepository } from 'src/domain/entity'
import { TeamDTO } from 'src/domain/team/dto'
import { Team } from 'src/domain/team/entities'
import { UserDTO } from 'src/domain/user/dto'

import { Cycle } from './entities'

@EntityRepository(Cycle)
class DomainCycleRepository extends DomainEntityRepository<Cycle> {
  setupOwnsQuery(query: SelectQueryBuilder<Cycle>) {
    return query.leftJoinAndSelect(`${Cycle.name}.team`, Team.name)
  }

  addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: Array<TeamDTO['id']>,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${Cycle.name}.teamId IN (:...allowedTeams)`, {
      allowedTeams,
    })
  }

  addOwnsWhereExpression(
    query: WhereExpression,
    user: UserDTO,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${Team.name}.ownerId = :userID`, {
      userID: user.id,
    })
  }
}

export default DomainCycleRepository
