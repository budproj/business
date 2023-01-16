import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { TaskStates } from '@core/modules/task/task.interface'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class GetUserCheckListProgressCommand extends Command<any> {
  public async execute(userID: User['id']): Promise<any> {
    const getKeyResults = this.factory.buildCommand<KeyResult[]>('get-user-key-results')
    const getKeyResultCheckMarks = this.factory.buildCommand<KeyResultCheckMark[]>(
      'get-check-list-for-key-result',
    )

    const keyResults = await getKeyResults.execute(userID, {}, { active: true })
    const filteredKeyResults = keyResults.filter((keyResult) => keyResult.teamId !== null)

    const keyResultsCheckMarkStates = await filteredKeyResults.reduce(
      async (promise, keyResult) => {
        const previous = await promise

        const checkmarks = await getKeyResultCheckMarks.execute(keyResult)

        const checked = checkmarks.filter((checkmark) => checkmark.state === TaskStates.CHECKED)

        return {
          checked: previous.checked + checked.length,
          total: previous.total + checkmarks.length,
        }
      },
      Promise.resolve({ checked: 0, total: 0 }),
    )

    return keyResultsCheckMarkStates
  }
}
