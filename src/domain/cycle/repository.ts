import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import DomainEntityRepository from 'domain/repository'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { Cycle } from './entities'

@EntityRepository(Cycle)
class DomainCycleRepository extends DomainEntityRepository<Cycle> {
  constraintQueryToCompany(allowedCompanies: Array<CompanyDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Cycle>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery.andWhere(
        `${Cycle.name}.companyId IN (:...allowedCompanies)`,
        { allowedCompanies },
      )

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToTeam(allowedTeams: Array<TeamDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Cycle>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${Cycle.name}.company`, 'company')
        .leftJoinAndSelect('company.teams', 'teams')
        .andWhere('teams.id IN (:...allowedTeams)', { allowedTeams })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToOwns(user: UserDTO) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Cycle>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${Cycle.name}.company`, 'company')
        .andWhere('company.ownerId = :userID', { userID: user.id })

      return constrainedQuery
    }

    return addConstraintToQuery
  }
}

export default DomainCycleRepository
