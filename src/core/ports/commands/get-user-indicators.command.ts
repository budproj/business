import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { TaskStates } from '@core/modules/task/task.interface'
import { User } from '@core/modules/user/user.orm-entity'

import { BaseDeltaCommand } from './base-delta.command'

export class GetUserIndicators extends BaseDeltaCommand {
  public async execute(userID: User['id'], options: GetStatusOptions = {}): Promise<any> {
    const getUserKeyResultsStatus = this.factory.buildCommand<Status>('get-user-key-results-status')

    const comparisonDate = this.getComparisonDate()
    const currentStatus = await getUserKeyResultsStatus.execute(userID, options)
    const previousStatus = await getUserKeyResultsStatus.execute(userID, {
      date: comparisonDate,
    })

    const delta = this.marshal(currentStatus, previousStatus)

    return {
      keyResultsProgress: {
        progress: currentStatus.progress,
        delta,
        latestCheckIn: currentStatus.latestCheckIn,
      },
      keyResultsCheckListProgress: {
        total: currentStatus.checkmarks.length,
        checked: currentStatus.checkmarks.filter(
          (checkmark) => checkmark.state === TaskStates.CHECKED,
        ).length,
      },
      keyResultsCheckInProgress: {
        total: currentStatus.total,
        checked: currentStatus.allUpToDateCheckIns.length,
      },
    }
  }
}
