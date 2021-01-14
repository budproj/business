import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import DomainEntityRepository, { CONSTRAINT_TYPE } from 'src/domain/repository'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResultView } from './entities'

@EntityRepository(KeyResultView)
class DomainKeyResultViewRepository extends DomainEntityRepository<KeyResultView> {
  constraintQueryToTeam(
    allowedTeams: Array<TeamDTO['id']>,
    user: UserDTO,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.AND,
  ) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<KeyResultView>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const ownsConstrainedQuery = this.constraintQueryToOwns(user, CONSTRAINT_TYPE.OR)(baseQuery)
      const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(
        constraintType,
      )

      const constrainedQuery = ownsConstrainedQuery
        .leftJoinAndSelect(`${KeyResultView.name}.user`, 'user')
        .leftJoinAndSelect('user.teams', 'teams')
        [constraintMethodName]('teams.id IN (:...allowedTeams)', { allowedTeams })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToOwns(user: UserDTO, constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.AND) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<KeyResultView>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(
        constraintType,
      )

      const constrainedQuery = baseQuery[constraintMethodName](
        `${KeyResultView.name}.userId = :userID`,
        {
          userID: user.id,
        },
      )

      return constrainedQuery
    }

    return addConstraintToQuery
  }
}

export default DomainKeyResultViewRepository
