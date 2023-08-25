import { Event } from '../../../messaging/events'

export abstract class TaskFulfiller<T extends Event> {
  abstract ingest(event: T): Promise<void>
}
