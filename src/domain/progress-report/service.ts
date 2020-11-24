import { Injectable } from '@nestjs/common'

import { KeyResultDTO } from 'domain/key-result/dto'

import { ProgressReport } from './entities'
import ProgressReportRepository from './repository'

@Injectable()
class ProgressReportService {
  constructor(private readonly repository: ProgressReportRepository) {}

  async getOneById(id: ProgressReport['id']): Promise<ProgressReport> {
    return this.repository.findOne({ id })
  }

  async getFromKeyResult(keyResultId: KeyResultDTO['id']): Promise<ProgressReport[]> {
    return this.repository.find({ keyResultId })
  }
}

export default ProgressReportService
