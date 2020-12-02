import { EntityRepository, Repository } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { UserDTO } from 'domain/user/dto'

import { User } from './entities'

@EntityRepository(User)
class DomainUserRepository extends Repository<User> {
  async findByIDWithCompanyConstraint(
    id: UserDTO['id'],
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<User | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const joinedQuery = filteredQuery.leftJoinAndSelect(`${User.name}.teams`, 'teams')
    const companyConstrainedQuery = joinedQuery.andWhere('teams.companyId IN (:...companies)', {
      companies: allowedCompanies,
    })

    return companyConstrainedQuery.getOne()
  }
}

export default DomainUserRepository
