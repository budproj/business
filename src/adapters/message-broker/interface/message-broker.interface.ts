import { Handler } from '../types/handler.type'

export interface MessageBrokerInterface {
  connect(endpoints: string[]): Promise<void>
  subscribe(topic: string, handler: Handler): void
  publish(topic: string, data: string): void
}
