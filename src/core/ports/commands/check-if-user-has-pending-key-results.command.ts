import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command';

import { Command } from './base.command'

/**
 * @deprecated fastest way to reuse logic without dealing with the high coupling between business logic and abstract command classes
 */
class CheckIfKeyResultIsOutdated extends BaseStatusCommand {
  // Ignoring, as we have no other way to deal with this (WARNING: extremely hacky way)
  // @ts-ignore
  async execute(keyResult: KeyResult): Promise<boolean> {
    const latestCheckIn = await this.core.keyResult.getLatestCheckInForKeyResultAtDate(keyResult.id)

    return this.isOutdated(latestCheckIn, new Date(), keyResult.createdAt)
  }
}

export class CheckIfUserHasPendingKeyResultCommand extends Command<boolean> {
  public async execute(id: User['id']): Promise<boolean> {
    const getUserKeyResults = this.factory.buildCommand<KeyResult[]>('get-user-key-results')
    const checkIfKeyResultIsOutdated = new CheckIfKeyResultIsOutdated(this.core, this.factory)

    const userKeyResults = await getUserKeyResults.execute(id, {})

    for (const keyResult of userKeyResults) {
      const isOutdated = await checkIfKeyResultIsOutdated.execute(keyResult)
      if (isOutdated) {
        return true
      }
    }

    return false
  }
}
