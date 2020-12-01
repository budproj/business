import { EntityRepository, Repository } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { ConfidenceReportDTO } from 'domain/key-result-report/confidence/dto'

import { ConfidenceReport } from './entities'

@EntityRepository(ConfidenceReport)
class ConfidenceReportRepository extends Repository<ConfidenceReport> {
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
}

export default ConfidenceReportRepository
