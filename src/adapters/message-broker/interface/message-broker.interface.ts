import { Handler } from '../types/handler.type'

export interface MessageBrokerInterface {
  send(queue: string, data: string): void
  receive(queue: string, handler: Handler, protocol?: string): void
}
