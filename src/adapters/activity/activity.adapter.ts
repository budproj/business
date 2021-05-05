import { ActivityDispatcher } from './interfaces/activity-dispatcher.interface'
import { Activity } from './interfaces/activity.interface'

export class ActivityAdapter<D extends string = string> {
  constructor(private readonly dispatchers: Record<D, ActivityDispatcher>) {}

  public async dispatch(activity: Activity, ignoreDispatchers: D[] = []): Promise<void> {
    const dispatchPromises = Object.entries<ActivityDispatcher>(this.dispatchers).map(
      ([name, dispatcher]) =>
        !ignoreDispatchers.includes(name as D) && dispatcher.dispatch(activity),
    )

    await Promise.all(dispatchPromises)
  }
}
