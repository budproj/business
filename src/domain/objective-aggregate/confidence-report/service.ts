import { Injectable } from '@nestjs/common'

import { ConfidenceReportDTO } from './dto'

@Injectable()
class ConfidenceReportService {
  filterLatestFromList(
    confidenceReports: ConfidenceReportDTO[],
  ): ConfidenceReportDTO | Record<string, unknown> {
    return confidenceReports.reduce(
      (previous: ConfidenceReportDTO | Record<string, unknown>, next: ConfidenceReportDTO) =>
        next.id > previous?.id ? next : previous,
      {},
    )
  }
}

export default ConfidenceReportService
