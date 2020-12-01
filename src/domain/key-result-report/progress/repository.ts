import { EntityRepository, Repository } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { ProgressReportDTO } from 'domain/key-result-report/progress/dto'

import { ProgressReport } from './entities'

@EntityRepository(ProgressReport)
class ProgressReportRepository extends Repository<ProgressReport> {
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
}

export default ProgressReportRepository
