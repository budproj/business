import { MessageException } from '@adapters/message-broker/types'

export type Event<T = unknown> = {
  userId: string
  companyId: string
  date: number
  payload: T
}

export abstract class EventPublisher {
  abstract publish<T extends Event>(topic: string, event: T): Promise<void>
}

export abstract class EventSubscriber {
  abstract subscribe<T extends Event>(
    topic: string,
    callback: (exception: MessageException, event: T) => void,
  ): void
}
