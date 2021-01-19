import { flow } from 'lodash'
import { Brackets, Repository, SelectQueryBuilder, WhereExpression } from 'typeorm'

import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

export type SelectionQueryConstrain<E> = (_query?: SelectQueryBuilder<E>) => SelectQueryBuilder<E>

export enum CONSTRAINT_TYPE {
  AND = 'and',
  OR = 'or',
}

export enum CONDITIONAL_METHOD_NAMES {
  AND_WHERE = 'andWhere',
  OR_WHERE = 'orWhere',
}

abstract class DomainEntityRepository<E> extends Repository<E> {
  composeTeamQuery = flow(this.setupOwnsQuery, this.setupTeamQuery)

  addTeamWhereExpression(
    _query: WhereExpression,
    _allowedTeams: Array<TeamDTO['id']>,
    _constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.OR,
  ): WhereExpression {
    throw new Error('You must implement the constraintQueryToTeam method')
  }

  addOwnsWhereExpression(
    _query: WhereExpression,
    _user: UserDTO,
    _constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.OR,
  ): WhereExpression {
    throw new Error('You must implement the constraintQueryToTeam method')
  }

  setupTeamQuery(query: SelectQueryBuilder<E>) {
    return query
  }

  setupOwnsQuery(query: SelectQueryBuilder<E>) {
    return query
  }

  constraintQueryToTeam(allowedTeams: Array<TeamDTO['id']>, user: UserDTO) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<E>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const composedQuery = this.composeTeamQuery(baseQuery)

      return composedQuery.andWhere(
        new Brackets((query) => {
          const teamOwnedEntities = this.addTeamWhereExpression(query, allowedTeams)
          const userAndTeamOwnedEntities = this.addOwnsWhereExpression(teamOwnedEntities, user)

          return userAndTeamOwnedEntities
        }),
      )
    }

    return addConstraintToQuery
  }

  constraintQueryToOwns(user: UserDTO) {
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

  selectConditionMethodNameBasedOnConstraintType(constraintType: CONSTRAINT_TYPE) {
    const methodNames = {
      [CONSTRAINT_TYPE.AND]: CONDITIONAL_METHOD_NAMES.AND_WHERE,
      [CONSTRAINT_TYPE.OR]: CONDITIONAL_METHOD_NAMES.OR_WHERE,
    }
    const constraintTypeMethodName = methodNames[constraintType]

    return constraintTypeMethodName
  }
}

export default DomainEntityRepository
