import { Identify } from '@amplitude/identify'
import { init, NodeClient as AmplitudeClient } from '@amplitude/node'
import { Injectable } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { ActivityDispatcher } from '@adapters/activity/interfaces/activity-dispatcher.interface'
import { Context } from '@adapters/context/interfaces/context.interface'
import { AmplitudeConfigProvider } from '@config/amplitude/amplitude.provider'

import { EventsFactory } from './events/events.factory'

@Injectable()
export class AmplitudeProvider implements ActivityDispatcher {
  private readonly client: AmplitudeClient

  constructor(private readonly events: EventsFactory, config: AmplitudeConfigProvider) {
    this.client = init(config.apiKey)
  }

  public async dispatch<D = any>(activity: Activity<D>): Promise<void> {
    const event = this.events.buildEventForActivity(activity)
    await event.loadProperties()

    const marshalledEvent = event.marshalEvent()

    await this.client.logEvent(marshalledEvent)
  }

  public async identify(context: Context): Promise<void> {
    const userID = context.user.id
    const { deviceID } = context.tracing
    const userProperties = context.user

    const userIdentification = new Identify()

    console.log(userID, deviceID, userProperties, userIdentification)

    // Await this.client.identify(userID, deviceID, userIdentification)
  }
}
