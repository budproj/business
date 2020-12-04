import { EntityRepository, Repository } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { ObjectiveDTO } from 'domain/objective/dto'
import { TeamDTO } from 'domain/team'
import { UserDTO } from 'domain/user'

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
    throw Error // TODO
  }

  async findByIDWithOwnsConstraint(
    id: ObjectiveDTO['id'],
    userID: UserDTO['id'],
  ): Promise<Objective | null> {
    throw Error // TODO
  }
}

export default DomainObjectiveRepository
