import { Delta } from '@core/interfaces/delta.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class GetUserKeyResultsProgressCommand extends Command<any> {
  public async execute(userID: User['id']): Promise<any> {
    const getKeyResults = this.factory.buildCommand<KeyResult[]>('get-user-key-results')
    const getKeyResultsDelta = this.factory.buildCommand<Delta>('get-key-result-delta')

    const keyResults = await getKeyResults.execute(userID, {}, { active: true })
    const filteredKeyResults = keyResults.filter((keyResult) => keyResult.teamId !== null)

    const keyResultsProgressAndDeltaSum = await filteredKeyResults.reduce(
      async (promise, keyResult) => {
        const previous = await promise

        const latestCheckIn = await this.core.keyResult.getLatestCheckInForKeyResultAtDate(
          keyResult.id,
        )

        const progress = await this.core.keyResult.getCheckInProgress(latestCheckIn, keyResult)
        const delta = await getKeyResultsDelta.execute(keyResult.id)

        return {
          progress: previous.progress + progress,
          delta: {
            progress: previous.delta.progress + delta.progress,
            confidence: previous.delta.confidence + delta.progress,
          },
        }
      },
      Promise.resolve({ progress: 0, delta: { progress: 0, confidence: 0 } }),
    )

    return {
      progress: keyResultsProgressAndDeltaSum?.progress / filteredKeyResults.length,
      delta: {
        progress: keyResultsProgressAndDeltaSum?.delta?.progress / filteredKeyResults.length,
        confidence: keyResultsProgressAndDeltaSum?.delta?.confidence / filteredKeyResults.length,
      },
    }
  }
}
