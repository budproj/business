import { EntityRepository, Repository } from 'typeorm'

import { KeyResultDTO } from 'domain/objective-aggregate/key-result/dto'

import { ProgressReport } from './entities'

@EntityRepository(ProgressReport)
class ProgressReportRepository extends Repository<ProgressReport> {
  async getLatestReportForKeyResult(keyResultID: KeyResultDTO['id']): Promise<ProgressReport> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ keyResult: keyResultID })
    const orderedByCreationDate = filteredQuery.orderBy('created_at', 'DESC')
    const data = orderedByCreationDate.getOne()

    return data
  }
}

export default ProgressReportRepository
