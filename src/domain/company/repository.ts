import { EntityRepository, Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { CompanyDTO } from 'domain/company/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user'

import { Company } from './entities'

@EntityRepository(Company)
class DomainCompanyRepository extends Repository<Company> {
  async findByIDWithCompanyConstraint(
    id: CompanyDTO['id'],
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<Company | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const companyConstrainedQuery = filteredQuery.andWhere(
      `${Company.name}.id IN (:...companies)`,
      {
        companies: allowedCompanies,
      },
    )

    return companyConstrainedQuery.getOne()
  }

  async findByIDWithTeamConstraint(
    id: CompanyDTO['id'],
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<any | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const joinedQuery = filteredQuery.innerJoin(
      `${Company.name}.teams`,
      'team',
      `team.id IN (:...teams)`,
      {
        teams: allowedTeams,
      },
    )

    return joinedQuery.getOne()
  }

  async findByIDWithOwnsConstraint(
    id: CompanyDTO['id'],
    userID: UserDTO['id'],
  ): Promise<Company | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const ownerConstrainedQuery = filteredQuery.andWhere('owner_id = :userID', {
      userID,
    })

    return ownerConstrainedQuery.getOne()
  }

  async updateByIDWithCompanyConstraint(
    id: CompanyDTO['id'],
    newData: QueryDeepPartialEntity<Company>,
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<Company | null> {
    console.log(id, newData, allowedCompanies)

    // Not implemented yet
  }

  async updateByIDWithTeamConstraint(
    id: CompanyDTO['id'],
    newData: QueryDeepPartialEntity<Company>,
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<Company | null> {
    console.log(id, newData, allowedTeams)

    // Not implemented yet
  }

  async updateByIDWithOwnsConstraint(
    id: CompanyDTO['id'],
    newData: QueryDeepPartialEntity<Company>,
    userID: UserDTO['id'],
  ): Promise<Company | null> {
    console.log(id, newData, userID)

    // Not implemented yet
  }
}

export default DomainCompanyRepository
