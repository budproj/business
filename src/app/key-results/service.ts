import { Injectable, Logger } from '@nestjs/common'

import { AuthzToken } from 'app/authz'
import { KeyResult } from 'domain/objective-aggregate/key-result/entities'
import { KeyResultLatestReport } from 'domain/objective-aggregate/key-result/service'
import ObjectiveAggregateService from 'domain/objective-aggregate/service'
import UserAggregateService from 'domain/user-aggregate/service'

export type KeyResultsHashmap = Record<KeyResult['id'], KeyResultLatestReport>

@Injectable()
class KeyResultsService {
  private readonly logger = new Logger(KeyResultsService.name)

  constructor(
    private readonly objectiveAggregateService: ObjectiveAggregateService,
    private readonly userAggregateService: UserAggregateService,
  ) {}

  async getUserKeyResults(authzSub: AuthzToken['sub']): Promise<KeyResultLatestReport[]> {
    this.logger.debug(`Getting key results that are owned by user with Auth0 sub ${authzSub}`)

    const uid = await this.userAggregateService.getUserIDBasedOnAuthzSub(authzSub)
    this.logger.debug(`Used user Auth0 sub ${authzSub} to select user with ID ${uid}`)

    const keyResults = await this.objectiveAggregateService.getKeyResultsOwnedBy(uid)
    this.logger.debug({ message: `Selected key results owned by user ${uid}:`, keyResults })

    return keyResults
  }

  buildHashmap(keyResults: KeyResult[]): KeyResultsHashmap {
    this.logger.debug({ message: 'Starting to create Key Results hashmap', keyResults })

    const initialHashmap = {}
    const reduceHandler = (previous: KeyResultsHashmap, next: KeyResult) => ({
      ...previous,
      [next.id]: next,
    })

    const hashmap = keyResults.reduce(reduceHandler, initialHashmap)
    this.logger.debug({ message: 'Finished creating Key Results hashmap', keyResults, hashmap })

    return hashmap
  }
}

export default KeyResultsService
