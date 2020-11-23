import { Injectable } from '@nestjs/common'

import { KeyResultDTO } from 'domain/objective-aggregate/key-result/dto'

import { ProgressReportDTO } from './dto'
import { ProgressReport } from './entities'
import ProgressReportRepository from './repository'

@Injectable()
class ProgressReportService {
  constructor(private readonly repository: ProgressReportRepository) {}

  filterLatestFromList(
    progressReports: ProgressReportDTO[],
  ): ProgressReportDTO | Record<string, unknown> {
    return progressReports.reduce(
      (previous: ProgressReportDTO | Record<string, unknown>, next: ProgressReportDTO) =>
        next.id > previous?.id ? next : previous,
      {},
    )
  }

  async getLatest(keyResultID: KeyResultDTO['id']): Promise<ProgressReport> {
    const latestReport = await this.repository.getLatestReportForKeyResult(keyResultID)

    return latestReport
  }
}

export default ProgressReportService
