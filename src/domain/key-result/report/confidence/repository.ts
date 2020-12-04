import { EntityRepository, Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { CompanyDTO } from 'domain/company/dto'
import { ConfidenceReportDTO } from 'domain/key-result/report/confidence/dto'
import { TeamDTO } from 'domain/team'
import { UserDTO } from 'domain/user'

import { ConfidenceReport } from './entities'

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
    allowedTeams: Array<TeamDTO['id']>,
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

  async updateByIDWithCompanyConstraint(
    id: ConfidenceReportDTO['id'],
    newData: QueryDeepPartialEntity<ConfidenceReport>,
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<ConfidenceReport | null> {
    console.log(id, newData, allowedCompanies)

    // Not implemented yet
  }

  async updateByIDWithTeamConstraint(
    id: ConfidenceReportDTO['id'],
    newData: QueryDeepPartialEntity<ConfidenceReport>,
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<ConfidenceReport | null> {
    console.log(id, newData, allowedTeams)

    // Not implemented yet
  }

  async updateByIDWithOwnsConstraint(
    id: ConfidenceReportDTO['id'],
    newData: QueryDeepPartialEntity<ConfidenceReport>,
    userID: UserDTO['id'],
  ): Promise<ConfidenceReport | null> {
    console.log(id, newData, userID)

    // Not implemented yet
  }
}

export default DomainConfidenceReportRepository
