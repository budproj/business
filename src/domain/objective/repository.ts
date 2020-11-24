import { EntityRepository, Repository } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { ObjectiveDTO } from 'domain/objective/dto'

import { Objective } from './entities'

@EntityRepository(Objective)
class ObjectiveRepository extends Repository<Objective> {
  async findByIDWithCompanyConstraint(
    id: ObjectiveDTO['id'],
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<Objective | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const joinedQuery = filteredQuery.leftJoinAndSelect(`${Objective.name}.cycle`, 'cycle')
    const companyConstrainedQuery = joinedQuery.andWhere('cycle.companyId IN (:...companies)', {
      companies: allowedCompanies,
    })

    return companyConstrainedQuery.getOne()
  }
}

export default ObjectiveRepository
