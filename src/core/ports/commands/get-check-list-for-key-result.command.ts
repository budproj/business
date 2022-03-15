import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class GetCheckListForKeyResultCommand extends Command<KeyResultCheckMark[]> {
  public async execute(keyResultId: KeyResult['id'], userId: User['id']) {
    return this.core.keyResult.keyResultCheckMarkProvider.getFromKeyResult(keyResultId, userId)
  }
}
