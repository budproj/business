import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NatsProvider {
  constructor(private readonly rabbitmq: AmqpConnection) {}

  /**
   * Sends a message to a rabbitmq channel and wait for it's response.
   *
   * @param channel the rabbitmq channel do send the message to
   * @param payload  the payload to be send
   */
  public async sendMessage<R>(channel: string, payload: unknown): Promise<R> {
    return this.rabbitmq.request<R>({
      exchange: 'bud',
      routingKey: channel,
      payload,
    })
  }
}
