import { Injectable } from '@nestjs/common'
import { pick } from 'lodash'
import { Codec, connect, Msg, NatsConnection, NatsError, StringCodec } from 'nats'

import {
  Handler,
  MessageBroker,
  MessageData,
  MessageException,
} from '@adapters/message-broker/message-broker.interface'
import { NatsHandler } from '@infrastructure/nats/nats.interface'

@Injectable()
export class NatsProvider implements MessageBroker {
  private connection: NatsConnection
  private readonly codec: Codec<string>

  constructor() {
    this.codec = StringCodec()
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
}
