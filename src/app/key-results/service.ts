import { Injectable, Logger } from '@nestjs/common'

import { AuthzToken } from 'app/authz'
import CompanyAggregate from 'domain/company-aggregate'
import ObjectiveAggregate from 'domain/objective-aggregate'

@Injectable()
class KeyResultsService {
  private readonly logger = new Logger(KeyResultsService.name)

  constructor(
    private readonly objectiveAggregate: ObjectiveAggregate,
    private readonly companyAggregate: CompanyAggregate,
  ) {}

  getUserKeyResults(uid: AuthzToken['sub']): string {
    this.logger.debug(`Getting key results that are owned by user ${uid}`)

    const keyResults = this.objectiveAggregate.getKeyResultsOwnedBy(uid)

    return keyResults
  }

  getUserTeamsKeyResults(uid: AuthzToken['sub']): string {
    this.logger.debug(`Getting all teams key results that user ${uid} is part of`)

    const userTeams = this.companyAggregate.getUserTeams(uid)
    console.log(userTeams)

    return 'My team Key Results'
  }

  getUserCompanyKeyResults(uid: AuthzToken['sub']): string {
    this.logger.debug(`Getting all key results for user ${uid} company`)

    return 'My company Key Results'
  }
}

export default KeyResultsService
