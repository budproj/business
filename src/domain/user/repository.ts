import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import DomainEntityRepository from 'src/domain/repository'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { User } from './entities'

@EntityRepository(User)
class DomainUserRepository extends DomainEntityRepository<User> {
  constraintQueryToCompany(teamIDsInCompany: Array<TeamDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<User>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${User.name}.teams`, 'teams')
        .andWhere('teams.id IN (:...teamIDsInCompany)', { teamIDsInCompany })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToTeam(allowedTeams: Array<TeamDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<User>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${User.name}.teams`, 'teams')
        .andWhere('teams.id IN (:...allowedTeams)', { allowedTeams })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToOwns(user: UserDTO) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<User>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery.andWhere(`${User.name}.id = :userID`, { userID: user.id })

      return constrainedQuery
    }

    return addConstraintToQuery
  }
}

export default DomainUserRepository
