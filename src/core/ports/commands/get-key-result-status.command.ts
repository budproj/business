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

    const progress = await this.core.keyResult.getCheckInProgress(latestCheckIn)
    const isOutdated = this.isOutdated(latestCheckIn)
    const isActive = await this.isActive(keyResultID)
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

  private async isActive(keyResultID: string): Promise<boolean> {
    const keyResult = await this.core.keyResult.getFromID(keyResultID)
    const objective = await this.core.objective.getFromKeyResult(keyResult)
    const cycle = await this.core.cycle.getFromObjective(objective)

    return cycle.active
  }
}
