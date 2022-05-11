import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'

import { Command } from './base.command'

export class GetUserYearlyProgressCommand extends Command<KeyResult[]> {
  public async execute(userID: UserInterface['id']): Promise<any> {
    const keyResults = await this.core.keyResult.getKeyResultsFromUserByCadence(
      userID,
      Cadence.YEARLY,
    )

    const progress = await this.core.keyResult.getProgressSum(keyResults)
    const averageProgress = progress / keyResults.length

    return {
      showProgress: keyResults.length > 0,
      progress: averageProgress,
    }
  }
}
