import { Event } from '@amplitude/node'

import { Activity } from '@adapters/activity/activities/base.activity'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { EventMetadata } from '../types/event-metadata.type'
import { EventProperties } from '../types/event-properties.type'

export abstract class BaseAmplitudeEvent<P extends EventProperties, D = any> {
  static activityType: string
  static amplitudeEventType: string

  protected core!: CorePortsProvider
  protected readonly metadata!: EventMetadata
  protected properties?: P

  constructor(protected readonly activity: Activity<D>, amplitudeEventType: string) {
    this.metadata = this.marshalMetadata(activity, amplitudeEventType)
  }

  public marshalEvent(): Event {
    return {
      event_type: this.metadata.amplitudeEventType,
      user_id: this.metadata.userID,
      session_id: this.metadata.sessionID,
      event_properties: this.properties,
    }
  }

  private marshalMetadata(activity: Activity<D>, amplitudeEventType: string): EventMetadata {
    return {
      ...activity.metadata,
      amplitudeEventType,
    }
  }

  public abstract loadProperties(): Promise<void>
}
