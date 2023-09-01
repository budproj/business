import { Event } from '@core/common/messaging/base-scenarios/events'

export abstract class TaskFulfiller<T extends Event> {
  abstract ingest(event: T): Promise<void>
}
