import { intersectionBy } from 'lodash'

import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { Command } from './base.command'

type Options = {
  active?: boolean
  onlyOwnerKeyResults?: boolean
}

export class GetUserKeyResultsCommand extends Command<KeyResult[]> {
  public async execute(
    userID: string,
    filters?: KeyResultInterface,
    options?: Options,
  ): Promise<KeyResult[]> {
    const ownedKeyResults = await this.core.keyResult.getOwnedByUserID(userID, filters)

    if (options.onlyOwnerKeyResults) {
      const keyResults = await this.applyOptions(ownedKeyResults, options)

      return keyResults
    }

    const supportTeamKeyResults = await this.core.keyResult.getAllWithUserIDInSupportTeam(
      userID,
      filters,
    )

    const allKeyResults = this.core.keyResult.getUniqueKeyResults(
      ownedKeyResults,
      supportTeamKeyResults,
    )
    const keyResults = await this.applyOptions(allKeyResults, options)

    return keyResults
  }

  private async applyOptions(keyResults: KeyResult[], options?: Options): Promise<KeyResult[]> {
    if (!options) return keyResults

    let filteredKeyResults: KeyResult[] = keyResults

    if (options.active)
      filteredKeyResults = intersectionBy(
        filteredKeyResults,
        await this.core.keyResult.filterActiveKeyResultsFromList(keyResults),
        'id',
      )

    return filteredKeyResults
  }
}
