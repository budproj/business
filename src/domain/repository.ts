import { Repository, SelectQueryBuilder } from 'typeorm'

import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { CompanyDTO } from './company/dto'

export type SelectionQueryConstrain<E> = (_query?: SelectQueryBuilder<E>) => SelectQueryBuilder<E>

abstract class DomainEntityRepository<E> extends Repository<E> {
  constraintQueryToCompany(_allowedCompanies: Array<CompanyDTO['id']>): SelectionQueryConstrain<E> {
    throw new Error('You must implement the constraintQueryToCompany method')
  }

  constraintQueryToTeam(_allowedTeams: Array<TeamDTO['id']>): SelectionQueryConstrain<E> {
    throw new Error('You must implement the constraintQueryToTeam method')
  }

  constraintQueryToOwns(_user: UserDTO): SelectionQueryConstrain<E> {
    throw new Error('You must implement the constraintQueryToOwns method')
  }
}

export default DomainEntityRepository
