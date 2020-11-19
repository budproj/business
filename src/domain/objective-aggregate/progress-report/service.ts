import { Injectable } from '@nestjs/common'

import { IProgressReport } from './dto'

@Injectable()
class ProgressReportService {
  filterLatestFromList(
    progressReports: IProgressReport[],
  ): IProgressReport | Record<string, unknown> {
    return progressReports.reduce(
      (previous: IProgressReport | Record<string, unknown>, next: IProgressReport) =>
        next.id > previous?.id ? next : previous,
      {},
    )
  }
}

export default ProgressReportService
