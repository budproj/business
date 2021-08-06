import { KeyResultCheckMarkInterface } from '@core/modules/key-result/check-mark/key-result-check-mark.interface'
import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'

import { Command } from './base.command'

export class GetKeyResultCheckMarkCommand extends Command<KeyResultCheckMark> {
  public async execute(indexes: Partial<KeyResultCheckMarkInterface>): Promise<KeyResultCheckMark> {
    return this.core.keyResult.keyResultCheckMarkProvider.getFromIndexes(indexes)
  }
}
