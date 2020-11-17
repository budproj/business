import { Injectable, Logger } from '@nestjs/common'

@Injectable()
class CompanyAggregateService {
  private readonly logger = new Logger(CompanyAggregateService.name)

  getUserTeams(uid: string): string {
    this.logger.debug(`Selecting available teams for user ${uid}`)
    return 'test'
  }
}

export default CompanyAggregateService
