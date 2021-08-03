import { CoreEntityRepository } from '@core/core.repository'
import { ConstraintType } from '@core/enums/contrain-type.enum'
import { UserInterface } from '@core/modules/user/user.interface'
import { EntityRepository, WhereExpression } from 'typeorm'
import { CheckMark } from './check-mark.orm-entity'

@EntityRepository(CheckMark)
export class CheckMarkRepository extends CoreEntityRepository<CheckMark> {
  public entityName = CheckMark.name

  protected addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: string[],
    constraintType?: ConstraintType,
  ): WhereExpression {
    return query
  }

  protected addOwnsWhereExpression(
    query: WhereExpression,
    user: UserInterface,
    constraintType?: ConstraintType,
  ): WhereExpression {
    return query
  }
}
