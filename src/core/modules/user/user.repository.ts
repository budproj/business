import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'
import { ConstrainType } from '@core/enums/contrain-type.enum'
import { TeamInterface } from '@core/modules/team/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'

import { UserInterface } from './user.interface'
import { User } from './user.orm-entity'

@EntityRepository(User)
export class UserRepository extends CoreEntityRepository<User> {
  protected setupTeamQuery(query: SelectQueryBuilder<User>) {
    return query.leftJoinAndSelect(`${User.name}.teams`, 'Team')
  }

  protected addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: Array<TeamInterface['id']>,
    constraintType: ConstrainType = ConstrainType.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${Team.name}.id IN (:...allowedTeams)`, {
      allowedTeams,
    })
  }

  protected addOwnsWhereExpression(
    query: WhereExpression,
    user: UserInterface,
    constraintType: ConstrainType = ConstrainType.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${User.name}.id = :userID`, {
      userID: user.id,
    })
  }
}
