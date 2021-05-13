import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

import { Command } from './base.command'

export class CreateKeyResultCheckInCommand extends Command<KeyResultCheckIn> {
  public async execute(checkIn: Partial<KeyResultCheckIn>): Promise<KeyResultCheckIn> {
    return this.core.keyResult.createCheckIn(checkIn)
  }
}
