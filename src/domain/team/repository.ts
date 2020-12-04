import { EntityRepository, Repository } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { TeamDTO } from 'domain/team/dto'

import { Team } from './entities'
import { UserDTO } from 'domain/user'

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
    throw Error // TODO
  }
}

export default DomainTeamRepository
