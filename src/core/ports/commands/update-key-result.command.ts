import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { Command } from './base.command'

export class UpdateKeyResultCommand extends Command<KeyResult> {
  public async execute(id: string, keyResult: Partial<KeyResultInterface>): Promise<KeyResult> {
    return this.core.keyResult.update({ id }, keyResult)
  }
}
