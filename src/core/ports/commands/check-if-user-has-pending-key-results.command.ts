import { Status } from '@core/interfaces/status.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class CheckIfUserHasPendingKeyResultCommand extends Command<number> {
  public async execute(id: User['id']): Promise<number> {
    const getUserKeyResults = this.factory.buildCommand<KeyResult[]>('get-user-key-results')
    const getKeyResultStatus = this.factory.buildCommand<Status>('get-key-result-status')

    const userKeyResults = await getUserKeyResults.execute(id, {})

    const pendingKeyResults = await userKeyResults.reduce(async (promise, keyResult) => {
      const previous = await promise

      const { isOutdated } = await getKeyResultStatus.execute(keyResult.id)

      if (isOutdated) return [...previous, keyResult]

      return previous
    }, Promise.resolve([]))

    return pendingKeyResults.length
  }
}
