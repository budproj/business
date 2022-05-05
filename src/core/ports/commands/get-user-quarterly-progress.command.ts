import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'

import { Command } from './base.command'

export class GetUserQuarterlyProgressCommand extends Command<KeyResult[]> {
  public async execute(userID: UserInterface['id']): Promise<any> {
    const keyResults = await this.core.keyResult.getCadencelyKeyResultsFromUser(
      userID,
      Cadence.QUARTERLY,
    )

    const progress = await keyResults.reduce(async (previous, currentKeyResult) => {
      const latestCheckIn = await this.core.keyResult.getLatestCheckInForKeyResultAtDate(
        currentKeyResult.id,
        new Date(),
      )

      const progress = await this.core.keyResult.getCheckInProgress(latestCheckIn, currentKeyResult)

      return (await previous) + progress
    }, Promise.resolve(0))

    return progress / keyResults.length
  }
}
