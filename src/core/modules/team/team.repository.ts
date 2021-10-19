import { EntityRepository, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'
import { ConstraintType } from '@core/enums/contrain-type.enum'
import { UserInterface } from '@core/modules/user/user.interface'

import { TeamInterface } from './interfaces/team.interface'
import { Team } from './team.orm-entity'

@EntityRepository(Team)
export class TeamRepository extends CoreEntityRepository<Team> {
  public entityName = Team.name

  public async addUserToTeam(userID: string, teamID: string): Promise<void> {
    await this.createQueryBuilder().relation(Team.name, 'users').of(teamID).add(userID)
  }

  public async removeUserFromTeam(userID: string, teamID: string): Promise<void> {
    await this.createQueryBuilder().relation(Team.name, 'users').of(teamID).remove(userID)
  }

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

    return query[constraintMethodName](`${Team.name}.ownerId = :userID`, {
      userID: user.id,
    })
  }
}
