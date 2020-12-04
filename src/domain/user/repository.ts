import { EntityRepository, Repository } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { TeamDTO } from 'domain/team/dto'
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

  async findByIDWithTeamConstraint(
    id: UserDTO['id'],
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<User | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const teamConstrainedQuery = filteredQuery.andWhere('teamsId IN (:...teams)', {
      teams: allowedTeams,
    })

    return teamConstrainedQuery.getOne()
  }

  async findByIDWithSelfConstraint(id: UserDTO['id'], userID: UserDTO['id']): Promise<User | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const selfConstrainedQuery = filteredQuery.andWhere('id = :userID', {
      userID,
    })

    return selfConstrainedQuery.getOne()
  }
}

export default DomainUserRepository
