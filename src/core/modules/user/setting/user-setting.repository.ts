import { EntityRepository, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'
import { ConstraintType } from '@core/enums/contrain-type.enum'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { UserSetting } from '@core/modules/user/setting/user-settings.orm-entity'

import { UserInterface } from '../user.interface'
import { User } from '../user.orm-entity'

@EntityRepository(UserSetting)
export class UserSettingRepository extends CoreEntityRepository<UserSetting> {
  public entityName = UserSetting.name

  protected addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: Array<TeamInterface['id']>,
    constraintType: ConstraintType = ConstraintType.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${Team.name}.id IN (:...allowedTeams)`, {
      allowedTeams,
    })
  }

  protected addOwnsWhereExpression(
    query: WhereExpression,
    user: UserInterface,
    constraintType: ConstraintType = ConstraintType.OR,
  ) {
    const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(constraintType)

    return query[constraintMethodName](`${User.name}.id = :userID`, {
      userID: user.id,
    })
  }
}
