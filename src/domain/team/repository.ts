import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import DomainEntityRepository from 'domain/repository'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { Team } from './entities'

@EntityRepository(Team)
class DomainTeamRepository extends DomainEntityRepository<Team> {
  constraintQueryToCompany(allowedCompanies: Array<CompanyDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Team>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery.andWhere(
        `${Team.name}.companyId IN (:...allowedCompanies)`,
        { allowedCompanies },
      )

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToTeam(allowedTeams: Array<TeamDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Team>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery.andWhere(`${Team.name}.id IN (:...allowedTeams)`, {
        allowedTeams,
      })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToOwns(user: UserDTO) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Team>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery.andWhere(`${Team.name}.ownerId = :userID`, {
        userID: user.id,
      })

      return constrainedQuery
    }

    return addConstraintToQuery
  }
}

export default DomainTeamRepository
