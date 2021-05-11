import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

import { Command } from './base.command'

export class GetKeyResultCheckInCommand extends Command<KeyResultCheckIn> {
  public async execute(indexes: Partial<KeyResultCheckInInterface>): Promise<KeyResultCheckIn> {
    return this.core.keyResult.getKeyResultCheckIn(indexes)
  }
}
