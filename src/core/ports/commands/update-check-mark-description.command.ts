import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'

import { Command } from './base.command'

export class UpdateCheckMarkDescriptionCommand extends Command<KeyResultCheckMark> {
  public async execute(checkMark: Partial<KeyResultCheckMark>): Promise<KeyResultCheckMark> {
    return this.core.keyResult.keyResultCheckMarkProvider.changeDescription(checkMark.id, checkMark.description)
  }
}
