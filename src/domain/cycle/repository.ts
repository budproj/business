import { EntityRepository, Repository } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { CycleDTO } from 'domain/cycle/dto'

import { Cycle } from './entities'

@EntityRepository(Cycle)
class CycleRepository extends Repository<Cycle> {
  async findByIDWithCompanyConstraint(
    id: CycleDTO['id'],
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<Cycle | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const companyConstrainedQuery = filteredQuery.andWhere(
      `${Cycle.name}.companyId IN (:...companies)`,
      {
        companies: allowedCompanies,
      },
    )

    return companyConstrainedQuery.getOne()
  }
}

export default CycleRepository
