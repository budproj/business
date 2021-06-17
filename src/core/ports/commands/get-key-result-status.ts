import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import {
  DEFAULT_CONFIDENCE,
  DEFAULT_PROGRESS,
} from '@core/modules/key-result/check-in/key-result-check-in.constants'

import { Command } from './base.command'

const defaultOptions: GetStatusOptions = {}

export class GetKeyResultStatusCommand extends Command<Status> {
  static buildDefaultStatus(): Status {
    return {
      progress: DEFAULT_PROGRESS,
      confidence: DEFAULT_CONFIDENCE,
    }
  }

  public async execute(
    keyResultID: string,
    options: GetStatusOptions = defaultOptions,
  ): Promise<Status> {
    const latestCheckIn = await this.core.keyResult.getLatestCheckInForKeyResultAtDate(
      keyResultID,
      options.date,
    )
    if (!latestCheckIn) return GetKeyResultStatusCommand.buildDefaultStatus()

    const keyResultProgress = await this.core.keyResult.getCheckInProgress(latestCheckIn)

    return {
      latestCheckIn,
      progress: keyResultProgress,
      confidence: latestCheckIn.confidence,
      reportDate: latestCheckIn.createdAt,
    }
  }
}
