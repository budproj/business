import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import DomainEntityRepository from 'src/domain/repository'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { Objective } from './entities'

@EntityRepository(Objective)
class DomainObjectiveRepository extends DomainEntityRepository<Objective> {
  constraintQueryToCompany(teamIDsInCompany: Array<TeamDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Objective>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${Objective.name}.cycle`, 'cycle')
        .andWhere('cycle.teamId IN (:...teamIDsInCompany)', { teamIDsInCompany })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToTeam(allowedTeams: Array<TeamDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Objective>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${Objective.name}.owner`, 'owner')
        .leftJoinAndSelect('owner.teams', 'teams')
        .andWhere('teams.id IN (:...allowedTeams)', { allowedTeams })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToOwns(user: UserDTO) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Objective>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery.andWhere(`${Objective.name}.ownerId = :userID`, {
        userID: user.id,
      })

      return constrainedQuery
    }

    return addConstraintToQuery
  }
}

export default DomainObjectiveRepository
