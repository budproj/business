import { Module } from '@nestjs/common'

import { NatsProvider } from './nats.provider'

@Module({
  providers: [NatsProvider],
  exports: [NatsProvider],
})
export class NatsModule {}
