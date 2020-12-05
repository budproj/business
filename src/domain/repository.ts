import { Repository, SelectQueryBuilder } from 'typeorm'

import { CompanyDTO } from './company/dto'

export type SelectionQueryConstrain<E> = (_query?: SelectQueryBuilder<E>) => SelectQueryBuilder<E>

abstract class DomainEntityRepository<E> extends Repository<E> {
  constraintQueryToCompany(_allowedCompanies: Array<CompanyDTO['id']>): SelectionQueryConstrain<E> {
    throw new Error('You must implement the constraintQueryToCompany method')
  }
}

export default DomainEntityRepository
