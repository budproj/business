import { flow } from 'lodash'
import { Brackets, Repository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { ConditionalMethodNames } from './enums/conditional-method-names.enum'
import { ConstraintType } from './enums/contrain-type.enum'
import { GetOptions } from './interfaces/get-options'
import { TeamInterface } from './modules/team/interfaces/team.interface'
import { UserInterface } from './modules/user/user.interface'
import { SelectionQueryConstrain } from './types/selection-query-constrain.type'

export abstract class CoreEntityRepository<E> extends Repository<E> {
  protected composeTeamQuery = flow(this.setupOwnsQuery, this.setupTeamQuery)

  public constraintQueryToTeam(
    allowedTeams: TeamInterface[],
    user: UserInterface,
  ): SelectionQueryConstrain<E> {
    const addConstraintToQuery = (query?: SelectQueryBuilder<E>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const composedQuery = this.composeTeamQuery(baseQuery)
      const allowedTeamIDs = allowedTeams.map((team) => team.id)

      return composedQuery.andWhere(
        new Brackets((query) => {
          const teamOwnedEntities = this.addTeamWhereExpression(query, allowedTeamIDs)
          const userAndTeamOwnedEntities = this.addOwnsWhereExpression(teamOwnedEntities, user)

          return userAndTeamOwnedEntities
        }),
      )
    }

    return addConstraintToQuery
  }

  public constraintQueryToOwns(user: UserInterface) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<E>) => {
      const baseQuery = query ?? this.createQueryBuilder()

      return baseQuery.andWhere(
        new Brackets((query) => {
          const userOwnedEntities = this.addOwnsWhereExpression(query, user)

          return userOwnedEntities
        }),
      )
    }

    return addConstraintToQuery
  }

  public marshalGetOptions(options?: GetOptions<E>) {
    return {
      take: options?.limit,
      skip: options?.offset,
      order: options?.orderBy,
    }
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
    const constraintTypeMethodName = methodNames[constraintType]

    return constraintTypeMethodName
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
