import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class GetCheckListOfUserCommand extends Command<KeyResultCheckMark[]> {
  public async execute(userId: User['id']) {
    return this.core.keyResult.keyResultCheckMarkProvider.getFromAssignedUser(userId)
  }
}
