import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'
import { DeleteResult } from 'typeorm'

import { Command } from './base.command'

export class DeleteCheckMarkCommand extends Command<DeleteResult> {
  public async execute(checkMarkId: KeyResultCheckMark["id"]) {
    return this.core.keyResult.keyResultCheckMarkProvider.delete({ id: checkMarkId })
  }
}
