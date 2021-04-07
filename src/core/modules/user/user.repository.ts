import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'
import { ConstrainType } from '@core/enums/contrain-type.enum'
import { TeamInterface } from '@core/modules/team/team.interface'
import { TeamORMEntity } from '@core/modules/team/team.orm-entity'

import { UserInterface } from './user.interface'
import { UserORMEntity } from './user.orm-entity'

@EntityRepository(UserORMEntity)
export class UserRepository extends CoreEntityRepository<UserORMEntity> {
  protected setupTeamQuery(query: SelectQueryBuilder<UserORMEntity>) {
    return query.leftJoinAndSelect(`${UserORMEntity.name}.teams`, 'Team')
  }

  protected addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: Array<TeamInterface['id']>,
    constraintType: ConstrainType = ConstrainType.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${TeamORMEntity.name}.id IN (:...allowedTeams)`, {
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