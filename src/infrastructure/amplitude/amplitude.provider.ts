import { Injectable } from '@nestjs/common'

import { ActivityDispatcher } from '@adapters/activity/interfaces/activity-dispatcher.interface'
import { Activity } from '@adapters/activity/interfaces/activity.interface'

import { EventsFactory } from './events/events.factory'

@Injectable()
export class AmplitudeProvider implements ActivityDispatcher {
  constructor(private readonly events: EventsFactory) {}

  public async dispatch(activity: Activity): Promise<void> {
    const event = this.events.buildEventForActivity(activity)
    console.log(event)
  }
}
