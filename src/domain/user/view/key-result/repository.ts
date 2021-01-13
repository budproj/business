import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import DomainEntityRepository from 'src/domain/repository'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResultView } from './entities'

@EntityRepository(KeyResultView)
class DomainKeyResultViewRepository extends DomainEntityRepository<KeyResultView> {
  constraintQueryToCompany(teamIDsInCompany: Array<TeamDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<KeyResultView>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${KeyResultView.name}.user`, 'user')
        .leftJoinAndSelect('user.teams', 'teams')
        .andWhere('teams.id IN (:...teamIDsInCompany)', { teamIDsInCompany })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToTeam(allowedTeams: Array<TeamDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<KeyResultView>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${KeyResultView.name}.user`, 'user')
        .leftJoinAndSelect('user.teams', 'teams')
        .andWhere('teams.id IN (:...allowedTeams)', { allowedTeams })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToOwns(user: UserDTO) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<KeyResultView>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery.andWhere(`${KeyResultView.name}.userId = :userID`, {
        userID: user.id,
      })

      return constrainedQuery
    }

    return addConstraintToQuery
  }
}

export default DomainKeyResultViewRepository
