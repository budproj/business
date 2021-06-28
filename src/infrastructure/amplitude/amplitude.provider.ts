import { init, NodeClient as AmplitudeClient } from '@amplitude/node'
import { Injectable, Logger, Scope } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { ActivityDispatcher } from '@adapters/activity/interfaces/activity-dispatcher.interface'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { AmplitudeConfigProvider } from '@config/amplitude/amplitude.provider'

import { EventsFactory } from './events/events.factory'
import { UserProperties } from './types/user-properties.type'

@Injectable({ scope: Scope.REQUEST })
export class AmplitudeProvider implements ActivityDispatcher {
  private readonly logger = new Logger(AmplitudeProvider.name)
  private readonly client: AmplitudeClient

  constructor(private readonly events: EventsFactory, config: AmplitudeConfigProvider) {
    this.client = init(config.apiKey)
  }

  static marshalUserProperties(user: UserWithContext): UserProperties {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
  }

  public async dispatch<D = any>(activity: Activity<D>): Promise<void> {
    const event = this.events.buildEventForActivity(activity)
    if (!event) return

    await event.prepare()
    const marshalledEvent = event.marshalEvent()

    this.logger.log({
      event: marshalledEvent,
      message: 'Logging event on Amplitude',
    })

    await this.client.logEvent(marshalledEvent)
  }
}
