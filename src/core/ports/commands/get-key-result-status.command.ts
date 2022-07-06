import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'

export class GetKeyResultStatusCommand extends BaseStatusCommand {
  public async execute(
    keyResultID: string,
    options: GetStatusOptions = this.defaultOptions,
  ): Promise<Status> {
    const keyResult = await this.core.keyResult.getFromID(keyResultID)
    const latestCheckIn = await this.core.keyResult.getLatestCheckInForKeyResultAtDate(
      keyResultID,
      options.date,
    )

    const progress = await this.core.keyResult.getCheckInProgress(latestCheckIn, keyResult)
    const isOutdated = this.isOutdated(latestCheckIn, new Date(), keyResult.createdAt)
    const isActive = await this.core.objective.isActive(keyResult.objectiveId)
    const confidence = latestCheckIn?.confidence ?? this.defaultStatus.confidence

    return {
      latestCheckIn,
      isOutdated,
      isActive,
      progress,
      confidence,
      reportDate: latestCheckIn?.createdAt,
    }
  }
}
