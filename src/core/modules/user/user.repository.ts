import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'
import { ConstrainType } from '@core/enums/contrain-type.enum'

import { TeamInterface } from '../team/team.interface'

import { UserEntity } from './user.entity'
import { UserInterface } from './user.interface'

@EntityRepository(UserEntity)
export class UserRepository extends CoreEntityRepository<UserEntity> {
  protected setupTeamQuery(query: SelectQueryBuilder<UserEntity>) {
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
