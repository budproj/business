import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { remove } from 'lodash'

import { ConfidenceReportDTO } from 'src/domain/key-result/report/confidence/dto'
import { ConfidenceReport } from 'src/domain/key-result/report/confidence/entities'
import { ProgressReportDTO } from 'src/domain/key-result/report/progress/dto'
import { ProgressReport } from 'src/domain/key-result/report/progress/entities'
import { UserDTO } from 'src/domain/user/dto'

import DomainConfidenceReportService from './confidence/service'
import DomainProgressReportService from './progress/service'

@Injectable()
class DomainKeyResultReportService {
  private readonly logger = new Logger(DomainKeyResultReportService.name)

  constructor(
    @Inject(forwardRef(() => DomainProgressReportService))
    public readonly progress: DomainProgressReportService,
    @Inject(forwardRef(() => DomainConfidenceReportService))
    public readonly confidence: DomainConfidenceReportService,
  ) {}

  async checkIn(
    progressReportData: Partial<ProgressReportDTO>,
    confidenceReportData: Partial<ConfidenceReportDTO>,
  ): Promise<Array<ProgressReport | ConfidenceReport>> {
    const createdProgressReports = await this.progress.create(progressReportData)
    this.logger.log({
      message: 'Handled progress report. Now, moving to confidence report',
      createdProgressReports,
    })

    const createdConfidenceReports = await this.confidence.create(confidenceReportData)
    this.logger.log({
      message: 'Handled confidence report. Now, returning them both',
      createdConfidenceReports,
    })

    const progressReport = createdProgressReports?.[0]
    const confidenceReport = createdConfidenceReports?.[0]

    const createdReports = remove([progressReport, confidenceReport])

    return createdReports
  }

  async getFromUsers(userIDs: Array<UserDTO['id']>) {
    const progressReports = await this.progress.getFromUsers(userIDs)
    const confidenceReports = await this.confidence.getFromUsers(userIDs)

    const reports = [...progressReports, ...confidenceReports]
    const clearedReports = remove(reports)

    return clearedReports
  }
}

export default DomainKeyResultReportService
