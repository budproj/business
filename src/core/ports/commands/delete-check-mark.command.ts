import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'
import { DeleteResult } from 'typeorm'

import { Command } from './base.command'

export class DeleteCheckMarkCommand extends Command<DeleteResult> {
  public async execute(checkMark: Partial<KeyResultCheckMark>) {
    return this.core.keyResult.keyResultCheckMarkProvider.delete({ id: checkMark.id })
  }
}
