import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import DomainEntityRepository from 'domain/repository'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { ConfidenceReport } from './entities'

@EntityRepository(ConfidenceReport)
class DomainConfidenceReportRepository extends DomainEntityRepository<ConfidenceReport> {
  constraintQueryToCompany(teamIDsInCompany: Array<TeamDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<ConfidenceReport>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${ConfidenceReport.name}.keyResult`, 'keyResult')
        .andWhere('keyResult.teamId IN (:...teamIDsInCompany)', { teamIDsInCompany })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToTeam(allowedTeams: Array<TeamDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<ConfidenceReport>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${ConfidenceReport.name}.keyResult`, 'keyResult')
        .leftJoinAndSelect('keyResult.team', 'team')
        .andWhere('team.id IN (:...allowedTeams)', { allowedTeams })

      return constrainedQuery
    }

    return addConstraintToQuery
  }

  constraintQueryToOwns(user: UserDTO) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<ConfidenceReport>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery.andWhere(`${ConfidenceReport.name}.userId = :userID`, {
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

export default DomainConfidenceReportRepository
