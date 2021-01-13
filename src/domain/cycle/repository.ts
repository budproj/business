import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import DomainEntityRepository from 'src/domain/repository'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { Cycle } from './entities'

@EntityRepository(Cycle)
class DomainCycleRepository extends DomainEntityRepository<Cycle> {
  constraintQueryToCompany(teamIDsInCompany: Array<TeamDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Cycle>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery.andWhere(
        `${Cycle.name}.teamId IN (:...teamIDsInCompany)`,
        {
          teamIDsInCompany,
        },
      )

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToTeam(allowedTeams: Array<TeamDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Cycle>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery.andWhere(`${Cycle.name}.teamId IN (:...allowedTeams)`, {
        allowedTeams,
      })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToOwns(user: UserDTO) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Cycle>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${Cycle.name}.team`, 'team')
        .andWhere('team.ownerId = :userID', { userID: user.id })

      return constrainedQuery
    }

    return addConstraintToQuery
  }
}

export default DomainCycleRepository
