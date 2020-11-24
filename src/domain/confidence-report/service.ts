import { Injectable } from '@nestjs/common'

import { KeyResultDTO } from 'domain/key-result/dto'

import { ConfidenceReport } from './entities'
import ConfidenceReportRepository from './repository'

@Injectable()
class ConfidenceReportService {
  constructor(private readonly repository: ConfidenceReportRepository) {}

  async getOneById(id: ConfidenceReport['id']): Promise<ConfidenceReport> {
    return this.repository.findOne({ id })
  }

  async getFromKeyResult(keyResultId: KeyResultDTO['id']): Promise<ConfidenceReport[]> {
    return this.repository.find({ keyResultId })
  }
}

export default ConfidenceReportService
