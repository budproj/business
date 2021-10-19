import { flatten, uniqBy } from 'lodash'

import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { Command } from './base.command'

export class GetUserKeyResultsCommand extends Command<KeyResult[]> {
  public async execute(userID: string, filters?: KeyResultInterface): Promise<KeyResult[]> {
    const ownedKeyResults = await this.core.keyResult.getOwnedByUserID(userID, filters)
    const supportTeamKeyResults = await this.core.keyResult.getAllWithUserIDInSupportTeam(
      userID,
      filters,
    )

    return this.getUniqueKeyResults(ownedKeyResults, supportTeamKeyResults)
  }

  private getUniqueKeyResults(...lists: KeyResult[][]): KeyResult[] {
    const flattenedLists = flatten(lists)

    return uniqBy(flattenedLists, 'id')
  }
}
