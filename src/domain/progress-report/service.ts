import { Injectable } from '@nestjs/common'

import { ProgressReport } from './entities'
import ProgressReportRepository from './repository'

@Injectable()
class ProgressReportService {
  constructor(private readonly repository: ProgressReportRepository) {}

  async getOneById(id: ProgressReport['id']): Promise<ProgressReport> {
    return this.repository.findOne({ id })
  }
}

export default ProgressReportService
