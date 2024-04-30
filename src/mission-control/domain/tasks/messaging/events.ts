import { Event } from '@core/common/messaging/base-scenarios/events'

export abstract class EventSubscriber {
  abstract subscribe<T extends Event>(topic: string, callback: (event: T) => void): Promise<void>
}
