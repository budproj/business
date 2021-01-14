import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import DomainEntityRepository, { CONSTRAINT_TYPE } from 'src/domain/repository'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { ProgressReport } from './entities'

@EntityRepository(ProgressReport)
class DomainProgressReportRepository extends DomainEntityRepository<ProgressReport> {
  constraintQueryToTeam(
    allowedTeams: Array<TeamDTO['id']>,
    user: UserDTO,
    constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.AND,
  ) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<ProgressReport>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const ownsConstrainedQuery = this.constraintQueryToOwns(user, CONSTRAINT_TYPE.OR)(baseQuery)
      const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(
        constraintType,
      )

      const constrainedQuery = ownsConstrainedQuery
        .leftJoinAndSelect(`${ProgressReport.name}.keyResult`, 'keyResult')
        [constraintMethodName]('keyResult.team_id IN (:...allowedTeams)', { allowedTeams })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToOwns(user: UserDTO, constraintType: CONSTRAINT_TYPE = CONSTRAINT_TYPE.AND) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<ProgressReport>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constraintMethodName = this.selectConditionMethodNameBasedOnConstraintType(
        constraintType,
      )

      const constrainedQuery = baseQuery[constraintMethodName](
        `${ProgressReport.name}.userId = :userID`,
        {
          userID: user.id,
        },
      )

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  async selectManyInUserIDs(userIDs: Array<UserDTO['id']>) {
    const query = this.createQueryBuilder().where('user_id IN(:...userIDs)', { userIDs })

    return query.getMany()
  }
}

export default DomainProgressReportRepository
