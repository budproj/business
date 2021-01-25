import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import DomainEntityRepository, { CONSTRAINT_TYPE } from 'src/domain/repository'
import { TeamDTO } from 'src/domain/team/dto'
import { Team } from 'src/domain/team/entities'
import { UserDTO } from 'src/domain/user/dto'
import { User } from 'src/domain/user/entities'

import { Objective } from './entities'

@EntityRepository(Objective)
class DomainObjectiveRepository extends DomainEntityRepository<Objective> {
  setupTeamQuery(query: SelectQueryBuilder<Objective>) {
    return query
      .leftJoinAndSelect(`${Objective.name}.owner`, User.name)
      .leftJoinAndSelect(`${User.name}.teams`, Team.name)
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

    return query[constraintMethodName](`${Objective.name}.ownerId = :userID`, {
      userID: user.id,
    })
  }
}

export default DomainObjectiveRepository
