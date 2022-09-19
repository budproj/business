import { ClientsModule, Transport } from '@nestjs/microservices'

import { ServerConfigModule } from '@config/server/server.module'
import { ServerConfigProvider } from '@config/server/server.provider'

export const NatsClient = ClientsModule.registerAsync([
  {
    name: 'NATS_SERVICE',
    imports: [ServerConfigModule],
    inject: [ServerConfigProvider],
    useFactory: async (configService: ServerConfigProvider) => ({
      transport: Transport.NATS,
      options: {
        servers: configService.natsServers,
      },
    }),
  },
])
