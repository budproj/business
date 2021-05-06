import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { Command } from './base.command'

export class GetKeyResultCommand extends Command<KeyResult> {
  public async execute(indexes: Partial<KeyResultInterface>): Promise<KeyResult> {
    const keyResult = await this.core.keyResult.getFromIndexes(indexes)

    return keyResult
  }
}
