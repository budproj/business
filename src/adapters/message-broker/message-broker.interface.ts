export interface MessageBroker {
  connect(endpoints: string[]): Promise<void>
  subscribe(topic: string, handler: Handler): void
}

export type Handler = (exception: MessageException, data: MessageData) => void | Promise<void>

export type MessageException = {
  name: string
  message: string
  code: string
}

export type MessageData = any
