import { EntityRepository, Repository } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { UserDTO } from 'domain/user'

import { Company } from './entities'

@EntityRepository(Company)
class DomainCompanyRepository extends Repository<Company> {
  async findByIDWithCompanyConstraint(
    id: CompanyDTO['id'],
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<Company | null> {
    throw Error // TODO
  }

  async findByIDWithTeamConstraint(
    id: CompanyDTO['id'],
    allowedTeams: Array<CompanyDTO['id']>,
  ): Promise<Company | null> {
    throw Error // TODO
  }

  async findByIDWithOwnsConstraint(
    id: CompanyDTO['id'],
    userID: UserDTO['id'],
  ): Promise<Company | null> {
    throw Error // TODO
  }
}

export default DomainCompanyRepository
