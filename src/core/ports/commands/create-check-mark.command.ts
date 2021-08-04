import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'

import { Command } from './base.command'

export class CreateCheckMarkCommand extends Command<KeyResultCheckMark> {
  public async execute(checkMark: KeyResultCheckMark): Promise<KeyResultCheckMark> {
    return this.core.keyResult.keyResultCheckMarkProvider.createCheckMark(checkMark)[0]
  }
}
