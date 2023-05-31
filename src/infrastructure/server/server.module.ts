/* eslint-disable unicorn/prevent-abbreviations */
import { Module } from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino'

import { ServerConfigModule } from '@config/server/server.module'
import { InfrastructureModule } from '@infrastructure/infrastructure.module'
import { InterfaceModule } from '@interface/interface.module'

@Module({
  imports: [
    ServerConfigModule,
    InterfaceModule,
    InfrastructureModule,
    LoggerModule.forRoot({
      pinoHttp: {
        redact: {
          paths: ['req.headers'],
        },
        customProps: (request, res) => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'yyyy-mm-dd HH:MM:ss.l o',
            singleLine: true,
          },
        },
      },
    }),
  ],
})
export class ServerModule {}
