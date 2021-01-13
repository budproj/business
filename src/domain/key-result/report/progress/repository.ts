import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import DomainEntityRepository from 'src/domain/repository'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { ProgressReport } from './entities'

@EntityRepository(ProgressReport)
class DomainProgressReportRepository extends DomainEntityRepository<ProgressReport> {
  constraintQueryToCompany(teamIDsInCompany: Array<TeamDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<ProgressReport>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${ProgressReport.name}.keyResult`, 'keyResult')
        .andWhere('keyResult.teamId IN (:...teamIDsInCompany)', { teamIDsInCompany })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToTeam(allowedTeams: Array<TeamDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<ProgressReport>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${ProgressReport.name}.keyResult`, 'keyResult')
        .leftJoinAndSelect('keyResult.team', 'team')
        .andWhere('team.id IN (:...allowedTeams)', { allowedTeams })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToOwns(user: UserDTO) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<ProgressReport>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery.andWhere(`${ProgressReport.name}.userId = :userID`, {
        userID: user.id,
      })

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
