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
    this.logger.debug(`Getting key results for user with ID ${uid}`)

    const userTeams = this.companyAggregate.getUserTeams(uid)
    this.objectiveAggregate.getKeyResultsForTeams(userTeams)

    return 'My Key Results'
  }
}

export default KeyResultsService
