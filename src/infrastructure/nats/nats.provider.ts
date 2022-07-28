import { Injectable } from '@nestjs/common'
import { pick } from 'lodash'
import { Codec, connect, Msg, NatsConnection, NatsError, JSONCodec } from 'nats'

import { MessageBrokerInterface } from '@adapters/message-broker/interface/message-broker.interface'
import { Handler, MessageData, MessageException } from '@adapters/message-broker/types'
import { NatsHandler } from '@infrastructure/nats/nats.interface'

@Injectable()
export class NatsProvider implements MessageBrokerInterface {
  private connection: NatsConnection
  private readonly codec: Codec<string>

  constructor() {
    this.codec = JSONCodec()
  }

  public async connect(endpoints: string[]): Promise<void> {
    this.connection = await connect({ servers: endpoints })
  }

  public subscribe(topic: string, handler: Handler): void {
    const callback = this.buildCallback(handler)

    this.connection.subscribe(topic, {
      callback,
    })
  }

  public publish(topic: string, message: string): void {
    const encodedMessage = this.encode(message)
    this.connection.publish(topic, encodedMessage)
  }

  private buildCallback(handler: Handler): NatsHandler {
    return async (error, message) => {
      const [exception, data] = this.decode(error, message)
      await handler(exception, data)
    }
  }

  private decode(error: NatsError, message: Msg): [MessageException, MessageData] {
    const exception = pick(error, ['name', 'message', 'code'])
    const decodedData = this.codec.decode(message.data)

    return [exception, decodedData]
  }

  private encode(message: string): MessageData {
    const encodedData = this.codec.encode(message)
    return encodedData
  }
}
