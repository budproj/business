import { Injectable, Logger } from '@nestjs/common'

import { PostProgressReportDTO } from 'app/progress-reports/dto'
import { KeyResultDTO } from 'domain/objective-aggregate/key-result/dto'
import { KeyResult } from 'domain/objective-aggregate/key-result/entities'
import ObjectiveAggregateService from 'domain/objective-aggregate/service'
import { UserDTO } from 'domain/user-aggregate/user/dto'

@Injectable()
class ProgressReportsService {
  private readonly logger = new Logger(ProgressReportsService.name)

  constructor(private readonly objectiveAggregateService: ObjectiveAggregateService) {}

  async createProgressReport(user: UserDTO, data: PostProgressReportDTO): Promise<string> {
    const latestReport = await this.objectiveAggregateService.getLatestProgressReport(
      data.keyResultID,
    )
    this.logger.debug({
      latestReport,
      message: `Selected the latest progress report for key result ${data.keyResultID.toString()}`,
    })

    return 'ok'
  }

  async getKeyResultOwner(keyResultID: KeyResultDTO['id']): Promise<KeyResult['owner']> {
    const owner = await this.objectiveAggregateService.getKeyResultOwner(keyResultID)

    return owner
  }
}

export default ProgressReportsService
