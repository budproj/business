import { Injectable } from '@nestjs/common'

import { IConfidenceReport } from './dto'

@Injectable()
class ConfidenceReportService {
  filterLatestFromList(
    confidenceReports: IConfidenceReport[],
  ): IConfidenceReport | Record<string, unknown> {
    return confidenceReports.reduce(
      (previous: IConfidenceReport | Record<string, unknown>, next: IConfidenceReport) =>
        next.id > previous?.id ? next : previous,
      {},
    )
  }
}

export default ConfidenceReportService
