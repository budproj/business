import { Module } from '@nestjs/common'

import { NatsProvider } from '@interface/nats/nats.provider'

@Module({
  providers: [NatsProvider],
})
export class NatsModule {}
