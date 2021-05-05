import { Injectable } from '@nestjs/common'

import { Activity } from '@adapters/activity/interfaces/activity.interface'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { BaseAmplitudeEvent } from './base.event'

@Injectable()
export class EventsFactory {
  constructor(private readonly core: CorePortsProvider) {}

  public buildEventForActivity(activity: Activity): BaseAmplitudeEvent {
    console.log(activity)

    return {} as any
  }
}
