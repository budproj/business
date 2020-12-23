import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { remove } from 'lodash'

import { ConfidenceReportDTO } from 'domain/key-result/report/confidence/dto'
import { ConfidenceReport } from 'domain/key-result/report/confidence/entities'
import { ProgressReportDTO } from 'domain/key-result/report/progress/dto'
import { ProgressReport } from 'domain/key-result/report/progress/entities'

import DomainConfidenceReportService from './confidence/service'
import DomainProgressReportService from './progress/service'

@Injectable()
class DomainKeyResultReportService {
  private readonly logger = new Logger(DomainKeyResultReportService.name)

  constructor(
    @Inject(forwardRef(() => DomainProgressReportService))
    public readonly progress: DomainProgressReportService,
    public readonly confidence: DomainConfidenceReportService,
  ) {}

  async checkIn(
    progressReportData: Partial<ProgressReportDTO>,
    confidenceReportData: Partial<ConfidenceReportDTO>,
  ): Promise<Array<ProgressReport | ConfidenceReport>> {
    const createdProgressReports = progressReportData.valueNew
      ? await this.progress.create(progressReportData)
      : []
    this.logger.log({
      message: 'Handled progress report. Now, moving to confidence report',
      createdProgressReports,
    })

    const createdConfidenceReports = confidenceReportData.valueNew
      ? await this.confidence.create(confidenceReportData)
      : []
    this.logger.log({
      message: 'Handled confidence report. Now, returning them both',
      createdConfidenceReports,
    })

    const progressReport = createdProgressReports?.[0]
    const confidenceReport = createdConfidenceReports?.[0]

    const createdReports = remove([progressReport, confidenceReport])

    return createdReports
  }
}

export default DomainKeyResultReportService
