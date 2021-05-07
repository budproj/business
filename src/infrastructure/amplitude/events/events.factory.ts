import { Injectable } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { CreatedKeyResultCommentAmplitudeEvent } from '@infrastructure/amplitude/events/created-key-result-comment.event'

import { EventProperties } from '../types/event-properties.type'

import { BaseAmplitudeEvent } from './base.event'
import { CreatedCheckInAmplitudeEvent } from './created-check-in.event'

@Injectable()
export class EventsFactory {
  private readonly eventConstructors = [
    CreatedCheckInAmplitudeEvent,
    CreatedKeyResultCommentAmplitudeEvent,
  ]

  constructor(private readonly core: CorePortsProvider) {}

  public buildEventForActivity<P extends EventProperties, D = any>(
    activity: Activity<D>,
  ): BaseAmplitudeEvent<P> | undefined {
    const Event = this.eventConstructors.find((event) => event.activityType === activity.type)
    if (!Event) return

    return new Event(activity as any, this.core) as any
  }
}
