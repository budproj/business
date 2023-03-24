import { Module } from '@nestjs/common'

import { RabbitMQClient } from './client'
import { NatsProvider } from './nats.provider'

@Module({
  imports: [RabbitMQClient],
  providers: [NatsProvider],
  exports: [NatsProvider],
})
export class NatsModule {}
