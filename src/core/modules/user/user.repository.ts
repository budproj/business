import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'
import { ConstrainType } from '@core/enums/contrain-type.enum'

import { TeamInterface } from '../team/team.interface'

import { UserInterface } from './user.interface'
import { UserORMEntity } from './user.orm-entity'

@EntityRepository(UserORMEntity)
export class UserRepository extends CoreEntityRepository<UserORMEntity> {
  protected setupTeamQuery(query: SelectQueryBuilder<UserORMEntity>) {
    return query.leftJoinAndSelect('User.teams', 'Team')
  }

  protected addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: Array<TeamInterface['id']>,
    constraintType: ConstrainType = ConstrainType.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName]('Team.id IN (:...allowedTeams)', {
      allowedTeams,
    })
  }

  protected addOwnsWhereExpression(
    query: WhereExpression,
    user: UserInterface,
    constraintType: ConstrainType = ConstrainType.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName]('User.id = :userID', {
      userID: user.id,
    })
  }
}
