import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CoreEntityInterface } from '@core/core-entity.interface'
import { CoreEntityRepository } from '@core/core.repository'
import { ConstraintType } from '@core/enums/contrain-type.enum'
import { GetOptions } from '@core/interfaces/get-options'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'

import { Objective } from './objective.orm-entity'

type ObjectiveRelationFilters = {
  cycle?: Partial<CycleInterface>
}

type RelationFilterQuery = {
  query: string
  variables: Record<string, any>
}

@EntityRepository(Objective)
export class ObjectiveRepository extends CoreEntityRepository<Objective> {
  public entityName = Objective.name

  public async getFromTeamWithRelationFilters(
    teamID: string,
    relationFilters: ObjectiveRelationFilters,
  ): Promise<Objective[]> {
    const cycleRelationFilter = this.buildRelationFilterQuery(Cycle.name, relationFilters.cycle)

    return this.createQueryBuilder()
      .leftJoin(`${Objective.name}.keyResults`, KeyResult.name)
      .where(`${KeyResult.name}.teamId = :teamID`, { teamID })
      .leftJoin(`${Objective.name}.cycle`, Cycle.name)
      .andWhere(cycleRelationFilter.query, cycleRelationFilter.variables)
      .getMany()
  }

  public async getFromCycleStatus(
    cycleIsActive: boolean,
    ids: string[],
    options?: GetOptions<Objective>,
  ): Promise<Objective[]> {
    if (ids.length === 0) return []

    return this.createQueryBuilder()
      .leftJoin(`${Objective.name}.cycle`, Cycle.name)
      .where(`${Objective.name}.id IN (:...ids)`, { ids })
      .andWhere(`${Cycle.name}.active = :cycleIsActive`, { cycleIsActive })
      .take(options?.limit)
      .offset(options?.offset)
      .getMany()
  }

  protected setupTeamQuery(query: SelectQueryBuilder<Objective>) {
    return query
      .leftJoinAndSelect(`${Objective.name}.owner`, User.name)
      .leftJoinAndSelect(`${User.name}.teams`, Team.name)
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

    return query[constraintMethodName](`${Objective.name}.ownerId = :userID`, {
      userID: user.id,
    })
  }

  private buildRelationFilterQuery(
    relationName: string,
    filter?: Partial<CoreEntityInterface>,
  ): RelationFilterQuery {
    if (!filter)
      return {
        query: '1 = 1',
        variables: {},
      }

    const queryParts = Object.keys(filter).map((key) => `${relationName}.${key} = :${key}`)
    const query = queryParts.join(' AND ')

    return {
      query,
      variables: filter,
    }
  }
}
