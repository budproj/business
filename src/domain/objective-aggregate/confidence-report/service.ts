import { Injectable } from '@nestjs/common'

import { IConfidenceReport } from './dto'

@Injectable()
class ConfidenceReportService {
  filterLatestFromList(confidenceReports: IConfidenceReport[]): IConfidenceReport {
    return confidenceReports.reduce((previous: IConfidenceReport | null, next: IConfidenceReport) =>
      next.id > previous.id ? next : previous,
    )
  }
}

export default ConfidenceReportService
