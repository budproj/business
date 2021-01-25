import { EntityRepository, WhereExpression } from 'typeorm'

import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { Team } from './entities'
import { CONSTRAINT_TYPE, DomainEntityRepository } from 'src/domain/entity'

@EntityRepository(Team)
class DomainTeamRepository extends DomainEntityRepository<Team> {
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

    return query[constraintMethodName](`${Team.name}.ownerId = :userID`, {
      userID: user.id,
    })
  }
}

export default DomainTeamRepository
