import { isEmpty, flatten, fromPairs } from 'lodash'
import { EntityRepository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CoreEntityRepository } from '@core/core.repository'
import { ConstraintType } from '@core/enums/contrain-type.enum'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'
import { OKRTreeFilters } from '@core/types/okr-tree-filters.type'

import { KeyResultInterface } from './interfaces/key-result.interface'
import { KeyResult } from './key-result.orm-entity'

type FilterQuery = {
  query: string
  variables: Record<string, any>
}

@EntityRepository(KeyResult)
export class KeyResultRepository extends CoreEntityRepository<KeyResult> {
  public readonly entityName = KeyResult.name
  private readonly entityKeyHashmap = {
    keyResultCheckIn: KeyResultCheckIn.name,
    keyResult: KeyResult.name,
    objective: Objective.name,
    cycle: Cycle.name,
  }

  public async findOKRTreeWithFilters(treeFilters: OKRTreeFilters): Promise<KeyResult[]> {
    const filters = this.buildFilters(treeFilters)

    return this.createQueryBuilder()
      .where(filters.query, filters.variables)
      .leftJoinAndSelect(`${KeyResult.name}.checkIns`, KeyResultCheckIn.name)
      .leftJoinAndSelect(`${KeyResult.name}.objective`, Objective.name)
      .leftJoinAndSelect(`${Objective.name}.cycle`, Cycle.name)
      .orderBy(`${KeyResultCheckIn.name}.createdAt`, 'DESC')
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

  private buildFilters(filters: OKRTreeFilters = {}): FilterQuery {
    if (isEmpty(filters))
      return {
        query: '1=1',
        variables: {},
      }

    const query = this.buildQueryFromFilters(filters)
    const variables = this.buildVariablesFromFilters(filters)

    return {
      query,
      variables,
    }
  }

  private buildQueryFromFilters(filters: OKRTreeFilters): string {
    const filterEntries = Object.entries(filters)
    const queries = filterEntries.map(([entity, entityFilters]) => {
      const entityKey = this.entityKeyHashmap[entity] as string
      const entityFilterKeys = Object.keys(entityFilters)

      return entityFilterKeys.map((key) => `${entityKey}.${key} = :${entity}_${key}`)
    })

    const flattenedQueries = flatten(queries)

    return flattenedQueries.join(' AND ')
  }

  private buildVariablesFromFilters(filters: OKRTreeFilters): Record<string, any> {
    const filterEntries = Object.entries(filters)
    const variablePairs = filterEntries.map(([entity, entityFilters]) => {
      const entityFilterEntries = Object.entries(entityFilters)
      return entityFilterEntries.map(([key, value]) => [`${entity}_${key}`, value])
    })

    return fromPairs(variablePairs.flat(1))
  }
}
