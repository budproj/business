import { Injectable, Logger } from '@nestjs/common'

import { PostProgressReportDTO } from 'app/progress-reports/dto'
import { KeyResultDTO } from 'domain/objective-aggregate/key-result/dto'
import { KeyResult } from 'domain/objective-aggregate/key-result/entities'
import { ProgressReportDTO } from 'domain/objective-aggregate/progress-report/dto'
import { ProgressReport } from 'domain/objective-aggregate/progress-report/entities'
import ObjectiveAggregateService from 'domain/objective-aggregate/service'
import { UserDTO } from 'domain/user-aggregate/user/dto'

@Injectable()
class ProgressReportsService {
  private readonly logger = new Logger(ProgressReportsService.name)

  constructor(private readonly objectiveAggregateService: ObjectiveAggregateService) {}

  async createProgressReport(user: UserDTO, data: PostProgressReportDTO): Promise<ProgressReport> {
    const latestReport = await this.objectiveAggregateService.getLatestProgressReport(
      data.keyResultID,
    )
    this.logger.debug({
      latestReport,
      message: `Selected the latest progress report for key result ${data.keyResultID.toString()}`,
    })

    const progressReport: Partial<ProgressReportDTO> = {
      valueNew: data.value,
      valuePrevious: latestReport.valueNew,
      comment: data.comment,
    }

    const createdReport = await this.objectiveAggregateService.createProgressReport(
      progressReport,
      user,
      data.keyResultID,
    )

    return createdReport
  }

  async getKeyResultOwner(keyResultID: KeyResultDTO['id']): Promise<KeyResult['owner']> {
    const owner = await this.objectiveAggregateService.getKeyResultOwner(keyResultID)

    return owner
  }
}

export default ProgressReportsService
