import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { Command } from './base.command'

export class GetKeyResultFromCheckInCommand extends Command<KeyResult> {
  static type = 'get-key-result-from-check-in-command'

  public async execute(checkIn: Partial<KeyResultCheckIn>): Promise<KeyResult> {
    const indexes = { id: checkIn.keyResultId }
    const keyResult = await this.core.keyResult.getFromIndexes(indexes)

    return keyResult
  }
}
