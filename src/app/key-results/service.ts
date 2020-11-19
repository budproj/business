import { Injectable, Logger } from '@nestjs/common'
import { omit } from 'lodash'

import { KeyResult } from 'domain/objective-aggregate/key-result/entities'
import ObjectiveAggregateService from 'domain/objective-aggregate/service'
import { User } from 'domain/user-aggregate/user/entities'

export type KeyResultsHashmap = Record<KeyResult['id'], KeyResult>

@Injectable()
class KeyResultsService {
  private readonly logger = new Logger(KeyResultsService.name)

  constructor(private readonly objectiveAggregateService: ObjectiveAggregateService) {}

  async getUserKeyResults(user: User): Promise<KeyResultsHashmap> {
    const dataWithRelations = await this.objectiveAggregateService.getOwnedBy(user)
    const dataFilteredByLatestReports = dataWithRelations.map((keyResult) => {
      const keyResultWithLatestReports = this.objectiveAggregateService.getLatestReportsForKeyResult(
        keyResult,
      )
      const normalizedKeyResult = omit(keyResultWithLatestReports, [
        'progressReports',
        'confidenceReports',
      ])

      return normalizedKeyResult
    })
    const hashmap = this.buildHashmap(dataFilteredByLatestReports)

    return hashmap
  }

  buildHashmap(keyResults: Array<Partial<KeyResult>>): KeyResultsHashmap {
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
