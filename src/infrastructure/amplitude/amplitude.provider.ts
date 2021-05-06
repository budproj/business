import { Identify } from '@amplitude/identify'
import { init, NodeClient as AmplitudeClient } from '@amplitude/node'
import { Injectable, Scope } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { ActivityDispatcher } from '@adapters/activity/interfaces/activity-dispatcher.interface'
import { Context } from '@adapters/context/interfaces/context.interface'
import { UserWithContext } from '@adapters/context/interfaces/user.interface'
import { AmplitudeConfigProvider } from '@config/amplitude/amplitude.provider'

import { EventsFactory } from './events/events.factory'
import { UserProperties } from './types/user-properties.type'

@Injectable({ scope: Scope.REQUEST })
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
    const userProperties = this.marshalUserProperties(context.user)

    const userIdentification = new Identify()
    this.attachPropertiesToIdentification(userProperties, userIdentification)

    await this.client.identify(userID, deviceID, userIdentification)
  }

  private marshalUserProperties(user: UserWithContext): UserProperties {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
  }

  private attachPropertiesToIdentification(
    properties: UserProperties,
    identification: Identify,
  ): void {
    Object.entries(properties).map(([key, value]) => identification.set(key, value))
  }
}
