import { flatten, intersectionBy, keyBy, uniq, uniqBy } from 'lodash'

import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { Command } from './base.command'

type Options = {
  active?: boolean
}

export class GetUserKeyResultsCommand extends Command<KeyResult[]> {
  public async execute(
    userID: string,
    filters?: KeyResultInterface,
    options?: Options,
  ): Promise<KeyResult[]> {
    const ownedKeyResults = await this.core.keyResult.getOwnedByUserID(userID, filters)
    const supportTeamKeyResults = await this.core.keyResult.getAllWithUserIDInSupportTeam(
      userID,
      filters,
    )

    const allKeyResults = this.getUniqueKeyResults(ownedKeyResults, supportTeamKeyResults)
    const keyResults = await this.applyOptions(allKeyResults, options)

    return keyResults
  }

  private getUniqueKeyResults(...lists: KeyResult[][]): KeyResult[] {
    const flattenedLists = flatten(lists)

    return uniqBy(flattenedLists, 'id')
  }

  private async applyOptions(keyResults: KeyResult[], options?: Options): Promise<KeyResult[]> {
    if (!options) return keyResults

    let filteredKeyResults: KeyResult[] = keyResults

    if (options.active)
      filteredKeyResults = intersectionBy(
        filteredKeyResults,
        await this.filterActiveKeyResultsFromList(keyResults),
        'id',
      )

    return filteredKeyResults
  }

  private async filterActiveKeyResultsFromList(keyResults: KeyResult[]): Promise<KeyResult[]> {
    const objectiveIDs = uniq(keyResults.map((keyResult) => keyResult.objectiveId))
    const objectivePromises = objectiveIDs.map(async (objectiveID) =>
      this.core.objective.getFromID(objectiveID),
    )
    const objectives = await Promise.all(objectivePromises)
    const objectivesHashmap = keyBy(objectives, 'id')

    const cycleIDs = uniq(objectives.map((objective) => objective.cycleId))
    const cyclePromises = cycleIDs.map(async (cycleID) => this.core.cycle.getFromID(cycleID))
    const cycles = await Promise.all(cyclePromises)
    const cyclesHashmap = keyBy(cycles, 'id')

    return keyResults.filter(
      (keyResult) => cyclesHashmap[objectivesHashmap[keyResult.objectiveId].cycleId].active,
    )
  }
}
