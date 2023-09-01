import { Event } from './events'

export abstract class EventPublisher {
  abstract publish<T extends Event>(topic: string, event: T): Promise<void>
}
