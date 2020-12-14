import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import DomainEntityRepository from 'domain/repository'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { ConfidenceReport } from './entities'

@EntityRepository(ConfidenceReport)
class DomainConfidenceReportRepository extends DomainEntityRepository<ConfidenceReport> {
  constraintQueryToCompany(allowedCompanies: Array<CompanyDTO['id']>) {
    const addConstraintToQuery = (query?: SelectQueryBuilder<ConfidenceReport>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${ConfidenceReport.name}.keyResult`, 'keyResult')
        .leftJoinAndSelect('keyResult.team', 'team')
        .andWhere('team.companyId IN (:...allowedCompanies)', { allowedCompanies })

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
}

export default DomainConfidenceReportRepository
