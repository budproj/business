import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { DynamicModule } from '@nestjs/common'

import { ServerConfigModule } from '@config/server/server.module'
import { ServerConfigProvider } from '@config/server/server.provider'

export const RabbitMQClient: DynamicModule = RabbitMQModule.forRootAsync(RabbitMQModule, {
  imports: [ServerConfigModule],
  inject: [ServerConfigProvider],
  useFactory: (configService: ServerConfigProvider) => {
    return {
      exchanges: [{ name: 'bud', type: 'topic' }],
      uri: configService.rabbitMQServer,
      enableControllerDiscovery: true,
    }
  },
})
