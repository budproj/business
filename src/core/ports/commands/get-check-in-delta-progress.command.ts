import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

import { Command } from './base.command'

export class GetCheckInDeltaProgressCommand extends Command<number> {
  public async execute(checkIn: KeyResultCheckIn): Promise<number> {
    const progressIncrease = await this.core.keyResult.getCheckInProgressIncrease(checkIn)

    return progressIncrease
  }
}
