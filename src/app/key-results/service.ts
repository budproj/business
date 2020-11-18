import { Injectable, Logger } from '@nestjs/common'

import { AuthzToken } from 'app/authz'
import CompanyAggregateService from 'domain/company-aggregate/service'
import ObjectiveAggregateService from 'domain/objective-aggregate/service'

@Injectable()
class KeyResultsService {
  private readonly logger = new Logger(KeyResultsService.name)

  constructor(
    private readonly objectiveAggregateService: ObjectiveAggregateService,
    private readonly companyAggregateService: CompanyAggregateService,
  ) {}

  getUserKeyResults(uid: AuthzToken['sub']): string {
    this.logger.debug(`Getting key results that are owned by user ${uid}`)

    const keyResults = this.objectiveAggregateService.getKeyResultsOwnedBy(uid)

    return keyResults
  }

  getUserTeamsKeyResults(uid: AuthzToken['sub']): string {
    this.logger.debug(`Getting all teams key results that user ${uid} is part of`)

    const userTeams = this.companyAggregateService.getUserTeams(uid)
    console.log(userTeams)

    return 'My team Key Results'
  }

  getUserCompanyKeyResults(uid: AuthzToken['sub']): string {
    this.logger.debug(`Getting all key results for user ${uid} company`)

    return 'My company Key Results'
  }
}

export default KeyResultsService
