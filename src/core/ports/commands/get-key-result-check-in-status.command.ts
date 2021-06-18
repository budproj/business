import { Status } from '@core/interfaces/status.interface'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'

export class GetKeyResultCheckInStatusCommand extends BaseStatusCommand {
  public async execute(keyResultCheckInID?: string): Promise<Status> {
    if (!keyResultCheckInID) return BaseStatusCommand.buildDefaultStatus()

    const latestCheckIn = await this.core.keyResult.keyResultCheckInProvider.getOne({
      id: keyResultCheckInID,
    })

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
