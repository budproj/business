import { Injectable, Logger } from '@nestjs/common'

import { KeyResult } from 'domain/objective-aggregate/key-result/entities'
import ObjectiveAggregateService from 'domain/objective-aggregate/service'
import { User } from 'domain/user-aggregate/user/entities'

export type KeyResultsHashmap = Record<KeyResult['id'], KeyResult>

@Injectable()
class KeyResultsService {
  private readonly logger = new Logger(KeyResultsService.name)

  constructor(private readonly objectiveAggregateService: ObjectiveAggregateService) {}

  async getUserKeyResults(uid: User['id']): Promise<KeyResult[]> {
    this.logger.debug(`Getting key results that are owned by user ${uid}`)

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
