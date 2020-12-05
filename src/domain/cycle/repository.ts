import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import DomainEntityRepository from 'domain/repository'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { Cycle } from './entities'

@EntityRepository(Cycle)
class DomainCycleRepository extends DomainEntityRepository<Cycle> {
  constraintQueryToCompany(allowedCompanies: Array<CompanyDTO['id']>) {
    const addContraintToQuery = (query?: SelectQueryBuilder<Cycle>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery.andWhere(
        `${Cycle.name}.companyId IN (:...allowedCompanies)`,
        { allowedCompanies },
      )

      return constrainedQuery
    }

    return addContraintToQuery
  }

  constraintQueryToTeam(allowedTeams: Array<TeamDTO['id']>) {
    const addContraintToQuery = (query?: SelectQueryBuilder<Cycle>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${Cycle.name}.company`, 'company')
        .leftJoinAndSelect('company.teams', 'teams')
        .andWhere('teams.id IN (:...allowedTeams)', { allowedTeams })

      return constrainedQuery
    }

    return addContraintToQuery
  }

  constraintQueryToOwns(user: UserDTO) {
    const addContraintToQuery = (query?: SelectQueryBuilder<Cycle>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${Cycle.name}.company`, 'company')
        .andWhere('company.ownerId = :userID', { userID: user.id })

      return constrainedQuery
    }

    return addContraintToQuery
  }
}

export default DomainCycleRepository
