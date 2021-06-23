import { Status } from '@core/interfaces/status.interface'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'

export class GetKeyResultCheckInStatusCommand extends BaseStatusCommand {
  public async execute(keyResultCheckInID?: string): Promise<Status> {
    const latestCheckIn = await this.core.keyResult.keyResultCheckInProvider.getOne({
      id: keyResultCheckInID,
    })

    const progress = await this.core.keyResult.getCheckInProgress(latestCheckIn)
    const isOutdated = this.isOutdated(latestCheckIn)
    const isActive = await this.isActive(keyResultCheckInID)
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

  private async isActive(keyResultCheckInID: string): Promise<boolean> {
    const keyResult = await this.core.keyResult.getFromKeyResultCheckInID(keyResultCheckInID)
    const objective = await this.core.objective.getFromKeyResult(keyResult)
    const cycle = await this.core.cycle.getFromObjective(objective)

    return cycle.active
  }
}
