import { Module } from '@nestjs/common'

import { NatsModule } from '@interface/nats/nats.module'

import { GraphQLModule } from './graphql/graphql.module'

@Module({
  imports: [GraphQLModule, NatsModule],
})
export class InterfaceModule {}
