import { Injectable, Logger } from '@nestjs/common'

import { AuthzToken } from 'app/authz'
import CompanyAggregateService from 'domain/company-aggregate/service'
import { KeyResult } from 'domain/objective-aggregate/key-result/entities'
import ObjectiveAggregateService from 'domain/objective-aggregate/service'
import UserAggregateService from 'domain/user-aggregate/service'

export type KeyResultsHashmap = Record<KeyResult['id'], KeyResult>

@Injectable()
class KeyResultsService {
  private readonly logger = new Logger(KeyResultsService.name)

  constructor(
    private readonly objectiveAggregateService: ObjectiveAggregateService,
    private readonly companyAggregateService: CompanyAggregateService,
    private readonly userAggregateService: UserAggregateService,
  ) {}

  async getUserKeyResults(authzSub: AuthzToken['sub']): Promise<KeyResult[]> {
    this.logger.debug(`Getting key results that are owned by user with Auth0 sub ${authzSub}`)

    const uid = await this.userAggregateService.getUserIDBasedOnAuthzSub(authzSub)
    const keyResults = await this.objectiveAggregateService.getKeyResultsOwnedBy(uid)

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

  buildHashmap(keyResults: KeyResult[]): KeyResultsHashmap {
    const initialHashmap = {}
    const reduceHandler = (previous: KeyResultsHashmap, next: KeyResult) => ({
      ...previous,
      [next.id]: next,
    })

    return keyResults.reduce(reduceHandler, initialHashmap)
  }
}

export default KeyResultsService
