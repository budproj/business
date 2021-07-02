import { flow, mapKeys, flatten, fromPairs, isEmpty } from 'lodash'
import { Brackets, Repository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { CoreEntityInterface } from '@core/core-entity.interface'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'

import { ConditionalMethodNames } from './enums/conditional-method-names.enum'
import { ConstraintType } from './enums/contrain-type.enum'
import { Sorting } from './enums/sorting'
import { GetOptions } from './interfaces/get-options'
import { TeamInterface } from './modules/team/interfaces/team.interface'
import { UserInterface } from './modules/user/user.interface'
import { SelectionQueryConstrain } from './types/selection-query-constrain.type'

type FilterQuery = {
  query: string
  variables: Record<string, any>
}

export type NullableFilters = Partial<Record<string, string[]>>

export abstract class CoreEntityRepository<E> extends Repository<E> {
  public entityName: string
  protected composeTeamQuery = flow(this.setupOwnsQuery, this.setupTeamQuery)

  protected readonly filterOperatorHashmap = {
    createdAt: '<',
    default: '=',
  }

  protected readonly entityKeyHashmap = {
    keyResultCheckIn: KeyResultCheckIn.name,
    keyResult: KeyResult.name,
    objective: Objective.name,
    cycle: Cycle.name,
    team: Team.name,
  }

  public constraintQueryToTeam(
    allowedTeams: TeamInterface[],
    user: UserInterface,
  ): SelectionQueryConstrain<E> {
    return (query?: SelectQueryBuilder<E>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const composedQuery = this.composeTeamQuery(baseQuery)
      const allowedTeamIDs = allowedTeams.map((team) => team.id)

      return composedQuery.andWhere(
        new Brackets((query) => {
          const teamOwnedEntities = this.addTeamWhereExpression(query, allowedTeamIDs)
          return this.addOwnsWhereExpression(teamOwnedEntities, user)
        }),
      )
    }
  }

  public constraintQueryToOwns(user: UserInterface) {
    return (query?: SelectQueryBuilder<E>) => {
      const baseQuery = query ?? this.createQueryBuilder()

      return baseQuery.andWhere(new Brackets((query) => this.addOwnsWhereExpression(query, user)))
    }
  }

  public marshalGetOptions(options?: GetOptions<E>) {
    return {
      take: options?.limit,
      skip: options?.offset,
      order: options?.orderBy,
    }
  }

  public marshalOrderBy(unmarshalled: Partial<Record<keyof E, Sorting>>): Record<string, Sorting> {
    return mapKeys(unmarshalled, (_, key) => `${this.entityName}.${key}`) as Record<string, Sorting>
  }

  protected setupTeamQuery(query: SelectQueryBuilder<E>) {
    return query
  }

  protected setupOwnsQuery(query: SelectQueryBuilder<E>) {
    return query
  }

  protected selectConditionMethodNameBasedOnConstraintType(constraintType: ConstraintType) {
    const methodNames = {
      [ConstraintType.AND]: ConditionalMethodNames.AND_WHERE,
      [ConstraintType.OR]: ConditionalMethodNames.OR_WHERE,
    }

    return methodNames[constraintType]
  }

  protected buildFilters(
    filters: Record<string, Partial<CoreEntityInterface>> = {},
    nullableFilters: NullableFilters = {},
  ): FilterQuery {
    if (isEmpty(filters))
      return {
        query: '1=1',
        variables: {},
      }

    const query = this.buildQueryFromFilters(filters, nullableFilters)
    const variables = this.buildVariablesFromFilters(filters)

    return {
      query,
      variables,
    }
  }

  private buildQueryFromFilters(
    filters: Record<string, Partial<CoreEntityInterface>>,
    nullableFilters: NullableFilters,
  ): string {
    const filterEntries = Object.entries(filters)
    const queries = filterEntries.map(([entity, entityFilters]) => {
      const entityKey = this.entityKeyHashmap[entity] as string
      const entityFilterKeys = Object.keys(entityFilters)
      const entityNullableFilters = nullableFilters[entity]

      return entityFilterKeys.map((key) =>
        this.buildFilterQuery(entityKey, entity, key, entityNullableFilters),
      )
    })

    const flattenedQueries = flatten(queries)

    return flattenedQueries.join(' AND ')
  }

  private buildFilterQuery(
    entityName: string,
    entity: string,
    key: string,
    nullableFilters?: string[],
  ): string {
    const isNullable = nullableFilters?.includes(key)
    const nullableQuery = isNullable ? `OR ${entityName}.${key} IS NULL` : ''
    const operator: string =
      key in this.filterOperatorHashmap
        ? this.filterOperatorHashmap[key]
        : this.filterOperatorHashmap.default

    return `(${entityName}.${key} ${operator} :${entity}_${key} ${nullableQuery})`
  }

  private buildVariablesFromFilters(
    filters: Record<string, Partial<CoreEntityInterface>>,
  ): Record<string, any> {
    const filterEntries = Object.entries(filters)
    const variablePairs = filterEntries.map(([entity, entityFilters]) => {
      const entityFilterEntries = Object.entries(entityFilters)
      return entityFilterEntries.map(([key, value]) => [`${entity}_${key}`, value])
    })

    return fromPairs(variablePairs.flat(1))
  }

  protected abstract addTeamWhereExpression(
    query: WhereExpression,
    allowedTeams: Array<TeamInterface['id']>,
    constraintType?: ConstraintType,
  ): WhereExpression

  protected abstract addOwnsWhereExpression(
    query: WhereExpression,
    user: UserInterface,
    constraintType?: ConstraintType,
  ): WhereExpression
}
