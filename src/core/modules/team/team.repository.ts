import { EntityRepository, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'
import { ConstrainType } from '@core/enums/contrain-type.enum'
import { UserInterface } from '@core/modules/user/user.interface'

import { TeamInterface } from './team.interface'
import { TeamORMEntity } from './team.orm-entity'

@EntityRepository(TeamORMEntity)
export class TeamRepository extends CoreEntityRepository<TeamORMEntity> {
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

    return query[constraintMethodName](`${TeamORMEntity.name}.ownerId = :userID`, {
      userID: user.id,
    })
  }
}
