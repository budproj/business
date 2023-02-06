import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class NatsProvider {
  constructor(@Inject('NATS_SERVICE') private readonly adapter: ClientProxy) {}

  public async sendMessage<T, R>(channel: string, data: T): Promise<R> {
    return lastValueFrom<R>(this.adapter.send(channel, data))
  }
}
