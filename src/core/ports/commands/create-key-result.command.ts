import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { Command } from './base.command'

export class CreateKeyResultCommand extends Command<KeyResult> {
  public async execute(data: KeyResultInterface): Promise<KeyResult> {
    return this.core.keyResult.createKeyResult(data)
  }
}
