import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CONSTRAINT_TYPE, DomainEntityRepository } from 'src/domain/entity'
import { TeamDTO } from 'src/domain/team/dto'
import { Team } from 'src/domain/team/entities'
import { UserDTO } from 'src/domain/user/dto'
import { User } from 'src/domain/user/entities'

import { KeyResultCustomList } from './entities'

@EntityRepository(KeyResultCustomList)
class DomainKeyResultCustomListRepository extends DomainEntityRepository<KeyResultCustomList> {
  setupTeamQuery(query: SelectQueryBuilder<KeyResultCustomList>) {
    return query
      .leftJoinAndSelect(`${KeyResultCustomList.name}.user`, User.name)
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

    return query[constraintMethodName](`${KeyResultCustomList.name}.userId = :userID`, {
      userID: user.id,
    })
  }
}

export default DomainKeyResultCustomListRepository
