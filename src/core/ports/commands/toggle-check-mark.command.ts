import { CheckMarkStates } from '@core/modules/key-result/check-mark/key-result-check-mark.interface'
import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'

import { Command } from './base.command'

export class ToggleCheckMarkCommand extends Command<KeyResultCheckMark> {
  public async execute(checkMark: Partial<KeyResultCheckMark>): Promise<KeyResultCheckMark> {
    const previousCheckMark = await this.core.keyResult.keyResultCheckMarkProvider.getFromIndexes({
      id: checkMark.id,
    })

    const possibleActions = {
      [CheckMarkStates.UNCHECKED]: async (id) => this.core.keyResult.keyResultCheckMarkProvider.checkCheckMark(id),
      [CheckMarkStates.CHECKED]: async (id) => this.core.keyResult.keyResultCheckMarkProvider.uncheckCheckMark(id),
    }
    const action = possibleActions[previousCheckMark.state]

    if (action) {
      return action(checkMark.id)
    }
  }
}
