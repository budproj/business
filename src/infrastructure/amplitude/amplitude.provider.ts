import { Injectable } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { ActivityDispatcher } from '@adapters/activity/interfaces/activity-dispatcher.interface'

import { EventsFactory } from './events/events.factory'

@Injectable()
export class AmplitudeProvider implements ActivityDispatcher {
  constructor(private readonly events: EventsFactory) {}

  public async dispatch<D = any>(activity: Activity<D>): Promise<void> {
    const event = this.events.buildEventForActivity(activity)
    await event.loadProperties()

    const marshalledEvent = event.marshalEvent()

    console.log(marshalledEvent)
  }
}
