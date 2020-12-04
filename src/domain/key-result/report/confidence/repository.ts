import { EntityRepository, Repository } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { ConfidenceReportDTO } from 'domain/key-result/report/confidence/dto'

import { ConfidenceReport } from './entities'
import { UserDTO } from 'domain/user'

@EntityRepository(ConfidenceReport)
class DomainConfidenceReportRepository extends Repository<ConfidenceReport> {
  async findByIDWithCompanyConstraint(
    id: ConfidenceReportDTO['id'],
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<ConfidenceReport | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const keyResultJoinedQuery = filteredQuery.leftJoinAndSelect(
      `${ConfidenceReport.name}.keyResult`,
      'keyResult',
    )
    const teamJoinedQuery = keyResultJoinedQuery.leftJoinAndSelect('keyResult.team', 'team')
    const companyConstrainedQuery = teamJoinedQuery.andWhere('team.companyId IN (:...companies)', {
      companies: allowedCompanies,
    })

    return companyConstrainedQuery.getOne()
  }

  async findByIDWithTeamConstraint(
    id: ConfidenceReportDTO['id'],
    allowedTeams: Array<ConfidenceReportDTO['id']>,
  ): Promise<ConfidenceReport | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const keyResultJoinedQuery = filteredQuery.leftJoinAndSelect(
      `${ConfidenceReport.name}.keyResult`,
      'keyResult',
    )
    const teamJoinedQuery = keyResultJoinedQuery.leftJoinAndSelect('keyResult.teamId', 'team')
    const teamConstrainedQuery = teamJoinedQuery.andWhere('teamId = :teams', {
      teams: allowedTeams,
    })

    return teamConstrainedQuery.getOne()
  }

  async findByIDWithOwnsConstraint(
    id: ConfidenceReportDTO['id'],
    userID: UserDTO['id'],
  ): Promise<ConfidenceReport | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const ownerConstrainedQuery = filteredQuery.andWhere('userId = :userID', {
      userID,
    })

    return ownerConstrainedQuery.getOne()
  }
}

export default DomainConfidenceReportRepository
