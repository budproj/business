import { Activity } from '@adapters/activity/interfaces/activity.interface'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { EventData } from '../types/event-data.type'
import { EventMetadata } from '../types/event-metadata.type'
import { AmplitudeEvent } from '../types/event.type'

export abstract class BaseAmplitudeEvent<P extends EventData = EventData> {
  static activityName: string

  protected core!: CorePortsProvider
  protected readonly activity: Activity
  protected properties?: P

  constructor(protected readonly metadata: EventMetadata) {}

  public marshal(): AmplitudeEvent {
    return {
      event_type: this.metadata.type,
      user_id: this.metadata.userID,
      session_id: this.metadata.sessionID,
      event_properties: this.properties,
    }
  }

  public abstract loadProperties(): Promise<void>
}
