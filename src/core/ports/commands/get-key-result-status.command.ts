import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'

export class GetKeyResultStatusCommand extends BaseStatusCommand {
  public async execute(
    keyResultID: string,
    options: GetStatusOptions = this.defaultOptions,
  ): Promise<Status> {
    const latestCheckIn = await this.core.keyResult.getLatestCheckInForKeyResultAtDate(
      keyResultID,
      options.date,
    )
    if (!latestCheckIn) return GetKeyResultStatusCommand.buildDefaultStatus()

    const currentProgress = await this.core.keyResult.getCheckInProgress(latestCheckIn)
    const isOutdated = this.isOutdated(latestCheckIn)

    return {
      latestCheckIn,
      isOutdated,
      progress: currentProgress,
      confidence: latestCheckIn.confidence,
      reportDate: latestCheckIn.createdAt,
    }
  }
}
