import { uniq } from 'lodash'

import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class GetKeyResultsContainingUserChecklistCommand extends Command<KeyResult[]> {
  public async execute(userId: User['id']) {
    const checkmarks = await this.core.keyResult.keyResultCheckMarkProvider.getFromAssignedUser(userId)

    const keyResultsIds = uniq(checkmarks.map((checkmark) => checkmark.keyResultId))

    const keyResults = await this.core.keyResult.getByIdsWhoAreInActiveCycles(keyResultsIds)

    return keyResults
  }
}
