import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import DomainEntityRepository, { CONSTRAINT_TYPE } from 'src/domain/repository'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { Cycle } from './entities'

@EntityRepository(Cycle)
class DomainCycleRepository extends DomainEntityRepository<Cycle> {
  constraintQueryToTeam(
    allowedTeams: Array<TeamDTO['id']>,
    user: UserDTO,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.AND,
  ) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Cycle>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const ownsConstrainedQuery = this.constraintQueryToOwns(user, CONSTRAINT_TYPE.OR)(baseQuery)
      const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(
        constraintType,
      )

      const constrainedQuery = ownsConstrainedQuery[constraintMethodName](
        `${Cycle.name}.teamId IN (:...allowedTeams)`,
        {
          allowedTeams,
        },
      )

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToOwns(user: UserDTO, constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.AND) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Cycle>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(
        constraintType,
      )

      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${Cycle.name}.team`, 'team')
        [constraintMethodName]('team.ownerId = :userID', { userID: user.id })

      return constrainedQuery
    }

    return addConstraintToQuery
  }
}

export default DomainCycleRepository
