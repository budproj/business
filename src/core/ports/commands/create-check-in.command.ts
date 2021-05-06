import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

import { Command } from './base.command'

export class CreateCheckInCommand extends Command<KeyResultCheckIn> {
  static type = 'create-check-in'

  public async execute(checkIn: Partial<KeyResultCheckIn>): Promise<KeyResultCheckIn> {
    const createdCheckIn = await this.core.keyResult.createCheckIn(checkIn)

    return createdCheckIn
  }
}
