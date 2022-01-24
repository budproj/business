import { CheckMarkStates } from '@core/modules/key-result/check-mark/key-result-check-mark.interface'
import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

interface CommandInput {
  checkMark: Partial<KeyResultCheckMark>
  user: Partial<User>
}

export class CreateCheckMarkCommand extends Command<KeyResultCheckMark> {
  public async execute({ checkMark, user }: CommandInput): Promise<KeyResultCheckMark> {
    const builtCheckMark = {
      description: checkMark.description,
      state: CheckMarkStates.UNCHECKED,
      keyResultId: checkMark.keyResultId,
      assignedUserId: user.id,
      userId: user.id,
    }

    const newCheckMark = await this.core.keyResult.keyResultCheckMarkProvider.createCheckMark(
      builtCheckMark,
    )

    return newCheckMark[0]
  }
}
