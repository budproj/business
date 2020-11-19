import { Injectable } from '@nestjs/common'

import { ProgressReportDTO } from './dto'

@Injectable()
class ProgressReportService {
  filterLatestFromList(
    progressReports: ProgressReportDTO[],
  ): ProgressReportDTO | Record<string, unknown> {
    return progressReports.reduce(
      (previous: ProgressReportDTO | Record<string, unknown>, next: ProgressReportDTO) =>
        next.id > previous?.id ? next : previous,
      {},
    )
  }
}

export default ProgressReportService
