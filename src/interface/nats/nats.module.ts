import { Module } from '@nestjs/common'

import { NatsClient } from './client'
import { NatsProvider } from './nats.provider'

@Module({
  imports: [NatsClient],
  providers: [NatsProvider],
  exports: [NatsProvider],
})
export class NatsModule {}
