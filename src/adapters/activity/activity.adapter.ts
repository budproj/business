import { Logger } from '@nestjs/common'

import { Activity } from './activities/base.activity'
import { ActivityDispatcher } from './interfaces/activity-dispatcher.interface'

export class ActivityAdapter<S extends string = string> {
  private readonly logger = new Logger(ActivityAdapter.name)

  constructor(private readonly dispatchers: Record<S, ActivityDispatcher>) {}

  public async dispatch<D = any>(
    activity: Activity<D>,
    ignoreDispatchers: S[] = [],
  ): Promise<void> {
    const dispatchPromises = Object.entries<ActivityDispatcher>(this.dispatchers).map(
      ([name, dispatcher]) =>
        !ignoreDispatchers.includes(name as S) && dispatcher.dispatch<D>(activity),
    )

    this.logger.log({
      activityType: activity.type,
      metadata: activity.metadata,
      data: activity.data,
      message: 'Dispatching activity',
    })

    await Promise.all(dispatchPromises)
  }
}
