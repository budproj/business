import { EntityRepository, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'
import { ConstrainType } from '@core/enums/contrain-type.enum'
import { UserInterface } from '@core/modules/user/user.interface'

import { TeamEntity } from './team.entity'
import { TeamInterface } from './team.interface'

@EntityRepository(TeamEntity)
export class TeamRepository extends CoreEntityRepository<TeamEntity> {
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

    return query[constraintMethodName]('Team.ownerId = :userID', {
      userID: user.id,
    })
  }
}
