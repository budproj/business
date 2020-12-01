import { Injectable, Logger } from '@nestjs/common'
import { remove } from 'lodash'

import { ConfidenceReportDTO } from 'domain/key-result-report/confidence/dto'
import { ConfidenceReport } from 'domain/key-result-report/confidence/entities'
import { ProgressReportDTO } from 'domain/key-result-report/progress/dto'
import { ProgressReport } from 'domain/key-result-report/progress/entities'

import ConfidenceReportService from './confidence/service'
import ProgressReportService from './progress/service'

@Injectable()
class KeyResultReportService {
  private readonly logger = new Logger(KeyResultReportService.name)

  constructor(
    public readonly progressReportService: ProgressReportService,
    public readonly confidenceReportService: ConfidenceReportService,
  ) {}

  async checkIn(
    progressReportData: Partial<ProgressReportDTO>,
    confidenceReportData: Partial<ConfidenceReportDTO>,
  ): Promise<Array<ProgressReport | ConfidenceReport>> {
    const createdProgressReports = await this.progressReportService.create(progressReportData)
    this.logger.log({
      message: 'Created progress report. Now, moving to confidence report',
      createdProgressReports,
    })

    const createdConfidenceReports = await this.confidenceReportService.create(confidenceReportData)
    this.logger.log({
      message: 'Created confidence report. Now, returning them both',
      createdConfidenceReports,
    })

    const progressReport = createdProgressReports?.[0]
    const confidenceReport = createdConfidenceReports?.[0]

    const createdReports = remove([progressReport, confidenceReport])

    return createdReports
  }
}

export default KeyResultReportService
