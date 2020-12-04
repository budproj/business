import { EntityRepository, Repository } from 'typeorm'

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
  ): Promise<Company | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const joinedQuery = filteredQuery.leftJoinAndSelect(`${Company.name}.teams`, 'teams')
    const teamConstrainedQuery = joinedQuery.andWhere('teams.id IN (:...teams)', {
      teams: allowedTeams,
    })

    return teamConstrainedQuery.getOne()
  }

  async findByIDWithOwnsConstraint(
    id: CompanyDTO['id'],
    userID: UserDTO['id'],
  ): Promise<Company | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const ownerConstrainedQuery = filteredQuery.andWhere('ownerID = :userID', {
      userID,
    })

    return ownerConstrainedQuery.getOne()
  }
}

export default DomainCompanyRepository
