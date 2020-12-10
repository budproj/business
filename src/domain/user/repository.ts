import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import DomainEntityRepository from 'domain/repository'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { User } from './entities'

@EntityRepository(User)
class DomainUserRepository extends DomainEntityRepository<User> {
  constraintQueryToCompany(allowedCompanies: Array<CompanyDTO['id']>) {
    const addContraintToQuery = (query?: SelectQueryBuilder<User>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${User.name}.teams`, 'teams')
        .andWhere('teams.companyId IN (:...allowedCompanies)', { allowedCompanies })

      return constrainedQuery
    }

    return addContraintToQuery
  }

  constraintQueryToTeam(allowedTeams: Array<TeamDTO['id']>) {
    const addContraintToQuery = (query?: SelectQueryBuilder<User>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${User.name}.teams`, 'teams')
        .andWhere('teams.id IN (:...allowedTeams)', { allowedTeams })

      return constrainedQuery
    }

    return addContraintToQuery
  }

  constraintQueryToOwns(user: UserDTO) {
    const addContraintToQuery = (query?: SelectQueryBuilder<User>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery.andWhere(`${User.name}.id = :userID`, { userID: user.id })

      return constrainedQuery
    }

    return addContraintToQuery
  }
}

export default DomainUserRepository
