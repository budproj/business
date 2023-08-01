import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'
import { Stopwatch } from '@lib/logger/pino.decorator';
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity';

export class GetKeyResultStatusCommand extends BaseStatusCommand {
  @Stopwatch()
  public async execute(
    keyResultOrID: string | KeyResult,
    options: GetStatusOptions = this.defaultOptions,
  ): Promise<Status> {
    const keyResult = typeof keyResultOrID === 'string' ? await this.core.keyResult.getFromID(keyResultOrID) : keyResultOrID
    const latestCheckIn = await this.core.keyResult.getLatestCheckInForKeyResultAtDate(
      keyResult.id,
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
