import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import DomainEntityRepository from 'domain/repository'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { Objective } from './entities'

@EntityRepository(Objective)
class DomainObjectiveRepository extends DomainEntityRepository<Objective> {
  constraintQueryToCompany(allowedCompanies: Array<CompanyDTO['id']>) {
    const addContraintToQuery = (query?: SelectQueryBuilder<Objective>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${Objective.name}.cycle`, 'cycle')
        .andWhere('cycle.companyId IN (:...allowedCompanies)', { allowedCompanies })

      return constrainedQuery
    }

    return addContraintToQuery
  }

  constraintQueryToTeam(allowedTeams: Array<TeamDTO['id']>) {
    const addContraintToQuery = (query?: SelectQueryBuilder<Objective>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${Objective.name}.owner`, 'owner')
        .leftJoinAndSelect('owner.teams', 'teams')
        .andWhere('teams.id IN (:...allowedTeams)', { allowedTeams })

      return constrainedQuery
    }

    return addContraintToQuery
  }

  constraintQueryToOwns(user: UserDTO) {
    const addContraintToQuery = (query?: SelectQueryBuilder<Objective>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery.andWhere(`${Objective.name}.ownerId = :userID`, {
        userID: user.id,
      })

      return constrainedQuery
    }

    return addContraintToQuery
  }
}

export default DomainObjectiveRepository
