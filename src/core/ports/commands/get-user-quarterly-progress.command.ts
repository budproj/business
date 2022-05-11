import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'

import { Command } from './base.command'

export class GetUserQuarterlyProgressCommand extends Command<KeyResult[]> {
  public async execute(userID: UserInterface['id']): Promise<any> {
    const keyResults = await this.core.keyResult.getKeyResultsFromUserByCadence(
      userID,
      Cadence.QUARTERLY,
    )

    const progress = await this.core.keyResult.getProgressSum(keyResults)
    const averageProgress = progress / keyResults.length

    return averageProgress
  }
}
