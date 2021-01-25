import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { TeamDTO } from 'src/domain/team/dto'
import { Team } from 'src/domain/team/entities'
import { UserDTO } from 'src/domain/user/dto'

import { User } from './entities'
import { CONSTRAINT_TYPE, DomainEntityRepository } from 'src/domain/entity'

@EntityRepository(User)
class DomainUserRepository extends DomainEntityRepository<User> {
  setupTeamQuery(query: SelectQueryBuilder<User>) {
    return query.leftJoinAndSelect(`${User.name}.teams`, Team.name)
  }

  addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: Array<TeamDTO['id']>,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${Team.name}.id IN (:...allowedTeams)`, {
      allowedTeams,
    })
  }

  addOwnsWhereExpression(
    query: WhereExpression,
    user: UserDTO,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${User.name}.id = :userID`, {
      userID: user.id,
    })
  }
}

export default DomainUserRepository
