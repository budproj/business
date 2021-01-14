import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import DomainEntityRepository, { CONSTRAINT_TYPE } from 'src/domain/repository'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { Objective } from './entities'

@EntityRepository(Objective)
class DomainObjectiveRepository extends DomainEntityRepository<Objective> {
  constraintQueryToTeam(
    allowedTeams: Array<TeamDTO['id']>,
    user: UserDTO,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.AND,
  ) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Objective>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const ownsConstrainedQuery = this.constraintQueryToOwns(user, CONSTRAINT_TYPE.OR)(baseQuery)
      const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(
        constraintType,
      )

      const constrainedQuery = ownsConstrainedQuery
        .leftJoinAndSelect(`${Objective.name}.owner`, 'owner')
        .leftJoinAndSelect('owner.teams', 'teams')
        [constraintMethodName]('teams.id IN (:...allowedTeams)', { allowedTeams })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToOwns(user: UserDTO, constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.AND) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<Objective>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(
        constraintType,
      )

      const constrainedQuery = baseQuery[constraintMethodName](
        `${Objective.name}.ownerId = :userID`,
        {
          userID: user.id,
        },
      )

      return constrainedQuery
    }

    return addConstraintToQuery
  }
}

export default DomainObjectiveRepository
