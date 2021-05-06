import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'

import { Command } from './base.command'

export class GetKeyResultCheckInListCommand extends Command<KeyResultCheckIn[]> {
  public async execute(keyResult: KeyResultInterface): Promise<KeyResultCheckIn[]> {
    const keyResultCheckIns = await this.core.keyResult.getCheckIns(keyResult)

    return keyResultCheckIns
  }
}
