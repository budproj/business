import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CoreEntityInterface } from '@core/core-entity.interface'
import { CoreEntityRepository } from '@core/core.repository'
import { ConstraintType } from '@core/enums/contrain-type.enum'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultInterface } from './interfaces/key-result.interface'
import { KeyResult } from './key-result.orm-entity'

type KeyResultRelationFilters = {
  cycle?: Partial<CycleInterface>
}

type RelationFilterQuery = {
  query: string
  variables: Record<string, any>
}

@EntityRepository(KeyResult)
export class KeyResultRepository extends CoreEntityRepository<KeyResult> {
  public entityName = KeyResult.name

  public async getFromTeamWithRelationFilters(
    teamID: string,
    relationFilters: KeyResultRelationFilters,
  ): Promise<KeyResult[]> {
    const cycleRelationFilter = this.buildRelationFilterQuery(Cycle.name, relationFilters.cycle)

    return this.createQueryBuilder()
      .where(`${KeyResult.name}.teamId = :teamID`, { teamID })
      .leftJoin(`${KeyResult.name}.objective`, Objective.name)
      .leftJoin(`${Objective.name}.cycle`, Cycle.name)
      .andWhere(cycleRelationFilter.query, cycleRelationFilter.variables)
      .getMany()
  }

  public async findByIdsRanked(ids: Array<KeyResultInterface['id']>, rank: string) {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where(`${KeyResult.name}.id IN (:...ids)`, { ids })
    const orderedQuery = filteredQuery.orderBy(rank)

    return orderedQuery.getMany()
  }

  protected setupTeamQuery(query: SelectQueryBuilder<KeyResult>) {
    return query.leftJoinAndSelect(`${KeyResult.name}.team`, Team.name)
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

    return query[constraintMethodName](`${KeyResult.name}.ownerId = :userID`, {
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
