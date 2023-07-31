import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'

import { Command } from './base.command'

export class UpdateCheckMarkAssigneeCommand extends Command<KeyResultCheckMark> {
  public async execute(checkMark: Partial<KeyResultCheckMark>): Promise<KeyResultCheckMark> {
    return this.core.keyResult.keyResultCheckMarkProvider.changeAssigned(checkMark.id, checkMark.assignedUserId)
  }
}
