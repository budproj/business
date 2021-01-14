import { Repository, SelectQueryBuilder } from 'typeorm'

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
  constraintQueryToCompany(
    _teamIDsInCompany: Array<TeamDTO['id']>,
    _user?: UserDTO,
  ): SelectionQueryConstrain<E> {
    throw new Error('You must implement the constraintQueryToCompany method')
  }

  constraintQueryToTeam(
    _allowedTeams: Array<TeamDTO['id']>,
    _user?: UserDTO,
  ): SelectionQueryConstrain<E> {
    throw new Error('You must implement the constraintQueryToTeam method')
  }

  constraintQueryToOwns(
    _user: UserDTO,
    _constraintType?: CONSTRAINT_TYPE,
  ): SelectionQueryConstrain<E> {
    throw new Error('You must implement the constraintQueryToOwns method')
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
