import { Injectable, Logger } from '@nestjs/common'

import { KeyResult } from 'domain/objective-aggregate/key-result/entities'
import { KeyResultsWithLatestReport } from 'domain/objective-aggregate/key-result/service'
import ObjectiveAggregateService from 'domain/objective-aggregate/service'
import { User } from 'domain/user-aggregate/user/entities'

export type KeyResultsHashmap = Record<KeyResult['id'], KeyResult>

@Injectable()
class KeyResultsService {
  private readonly logger = new Logger(KeyResultsService.name)

  constructor(private readonly objectiveAggregateService: ObjectiveAggregateService) {}

  async getUserKeyResults(user: User): Promise<KeyResultsHashmap> {
    const keyResults = await this.objectiveAggregateService.getOwnedBy(user)
    const keyResultsHashmap = this.buildHashmap(keyResults)

    return keyResultsHashmap
  }

  buildHashmap(keyResults: KeyResultsWithLatestReport[]): KeyResultsHashmap {
    this.logger.debug({ message: 'Starting to create Key Results hashmap', keyResults })

    const initialHashmap = {}
    const reduceHandler = (previous: KeyResultsHashmap, next: KeyResultsWithLatestReport) => ({
      ...previous,
      [next.id]: next,
    })

    const hashmap = keyResults.reduce(reduceHandler, initialHashmap)
    this.logger.debug({ message: 'Finished creating Key Results hashmap', keyResults, hashmap })

    return hashmap
  }
}

export default KeyResultsService
