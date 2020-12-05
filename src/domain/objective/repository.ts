import { EntityRepository, Repository } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { ObjectiveDTO } from 'domain/objective/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { Objective } from './entities'

@EntityRepository(Objective)
class DomainObjectiveRepository extends Repository<Objective> {
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

  async findByIDWithTeamConstraint(
    id: ObjectiveDTO['id'],
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<Objective | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const joinedQuery = filteredQuery.leftJoinAndSelect(`${Objective.name}.owner`, 'owner')
    const teamConstrainedQuery = joinedQuery.andWhere('owner.teamId IN (:...teams)', {
      teams: allowedTeams,
    })

    return teamConstrainedQuery.getOne()
  }

  async findByIDWithOwnsConstraint(
    id: ObjectiveDTO['id'],
    userID: UserDTO['id'],
  ): Promise<Objective | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const ownerConstrainedQuery = filteredQuery.andWhere('owner_id = :userID', {
      userID,
    })

    return ownerConstrainedQuery.getOne()
  }
}

export default DomainObjectiveRepository
