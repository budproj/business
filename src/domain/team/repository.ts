import { EntityRepository, Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { CompanyDTO } from 'domain/company/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { Team } from './entities'

@EntityRepository(Team)
class DomainTeamRepository extends Repository<Team> {
  async findByIDWithCompanyConstraint(
    id: TeamDTO['id'],
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<Team | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const companyConstrainedQuery = filteredQuery.andWhere(
      `${Team.name}.companyId IN (:...companies)`,
      {
        companies: allowedCompanies,
      },
    )

    return companyConstrainedQuery.getOne()
  }

  async findByIDWithTeamConstraint(
    id: TeamDTO['id'],
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<Team | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const teamConstrainedQuery = filteredQuery.andWhere('id IN (:...teams)', {
      teams: allowedTeams,
    })

    return teamConstrainedQuery.getOne()
  }

  async findByIDWithOwnsConstraint(id: TeamDTO['id'], userID: UserDTO['id']): Promise<Team | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const ownerConstrainedQuery = filteredQuery.andWhere('owner_id = :userID', {
      userID,
    })

    return ownerConstrainedQuery.getOne()
  }

  async updateByIDWithCompanyConstraint(
    id: TeamDTO['id'],
    newData: QueryDeepPartialEntity<Team>,
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<Team | null> {
    console.log(id, newData, allowedCompanies)

    return null // eslint-disable-line unicorn/no-null
  }

  async updateByIDWithTeamConstraint(
    id: TeamDTO['id'],
    newData: QueryDeepPartialEntity<Team>,
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<Team | null> {
    console.log(id, newData, allowedTeams)

    return null // eslint-disable-line unicorn/no-null
  }

  async updateByIDWithOwnsConstraint(
    id: TeamDTO['id'],
    newData: QueryDeepPartialEntity<Team>,
    userID: UserDTO['id'],
  ): Promise<Team | null> {
    console.log(id, newData, userID)

    return null // eslint-disable-line unicorn/no-null
  }
}

export default DomainTeamRepository
