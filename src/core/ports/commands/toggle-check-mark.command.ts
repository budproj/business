import { CheckMarkStates } from '@core/modules/key-result/check-mark/key-result-check-mark.interface'
import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'

import { Command } from './base.command'

export class ToggleCheckMarkCommand extends Command<KeyResultCheckMark> {
  public async execute(checkMark: Partial<KeyResultCheckMark>): Promise<KeyResultCheckMark> {
    const { checkCheckMark, uncheckCheckMark } = this.core.keyResult.keyResultCheckMarkProvider
    const possibleActions = {
      [CheckMarkStates.UNCHECKED]: checkCheckMark,
      [CheckMarkStates.CHECKED]: uncheckCheckMark,
    }
    const action = possibleActions[checkMark.state]

    if (action) { return action(checkMark.id) }
  }
}
