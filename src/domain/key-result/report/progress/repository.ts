import { EntityRepository, Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { CompanyDTO } from 'domain/company/dto'
import { ProgressReportDTO } from 'domain/key-result/report/progress/dto'
import { TeamDTO } from 'domain/team'
import { UserDTO } from 'domain/user'

import { ProgressReport } from './entities'

@EntityRepository(ProgressReport)
class DomainProgressReportRepository extends Repository<ProgressReport> {
  async findByIDWithCompanyConstraint(
    id: ProgressReportDTO['id'],
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<ProgressReport | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const keyResultJoinedQuery = filteredQuery.leftJoinAndSelect(
      `${ProgressReport.name}.keyResult`,
      'keyResult',
    )
    const teamJoinedQuery = keyResultJoinedQuery.leftJoinAndSelect('keyResult.team', 'team')
    const companyConstrainedQuery = teamJoinedQuery.andWhere('team.companyId IN (:...companies)', {
      companies: allowedCompanies,
    })

    return companyConstrainedQuery.getOne()
  }

  async findByIDWithTeamConstraint(
    id: ProgressReportDTO['id'],
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<ProgressReport | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const keyResultJoinedQuery = filteredQuery.leftJoinAndSelect(
      `${ProgressReport.name}.keyResult`,
      'keyResult',
    )
    const teamJoinedQuery = keyResultJoinedQuery.leftJoinAndSelect('keyResult.teamId', 'team')
    const teamConstrainedQuery = teamJoinedQuery.andWhere('teamId = :teams', {
      teams: allowedTeams,
    })

    return teamConstrainedQuery.getOne()
  }

  async findByIDWithOwnsConstraint(
    id: ProgressReportDTO['id'],
    userID: UserDTO['id'],
  ): Promise<ProgressReport | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const ownerConstrainedQuery = filteredQuery.andWhere('userId = :userID', {
      userID,
    })

    return ownerConstrainedQuery.getOne()
  }

  async updateByIDWithCompanyConstraint(
    id: ProgressReportDTO['id'],
    newData: QueryDeepPartialEntity<ProgressReport>,
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<ProgressReport | null> {
    console.log(id, newData, allowedCompanies)

    return null // eslint-disable-line unicorn/no-null
  }

  async updateByIDWithTeamConstraint(
    id: ProgressReportDTO['id'],
    newData: QueryDeepPartialEntity<ProgressReport>,
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<ProgressReport | null> {
    console.log(id, newData, allowedTeams)

    return null // eslint-disable-line unicorn/no-null
  }

  async updateByIDWithOwnsConstraint(
    id: ProgressReportDTO['id'],
    newData: QueryDeepPartialEntity<ProgressReport>,
    userID: UserDTO['id'],
  ): Promise<ProgressReport | null> {
    console.log(id, newData, userID)

    return null // eslint-disable-line unicorn/no-null
  }
}

export default DomainProgressReportRepository
