import { EntityRepository, Repository } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { ProgressReportDTO } from 'domain/key-result/report/progress/dto'

import { ProgressReport } from './entities'
import { UserDTO } from 'domain/user'

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
    allowedTeams: Array<ProgressReportDTO['id']>,
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
}

export default DomainProgressReportRepository
