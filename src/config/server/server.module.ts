import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { ServerEnvironmentSchema } from './server-environment.schema'
import { serverConfig } from './server.config'
import { ServerConfigProvider } from './server.provider'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [serverConfig],
      validationSchema: ServerEnvironmentSchema,
    }),
  ],
  providers: [ConfigService, ServerConfigProvider],
  exports: [ConfigService, ServerConfigProvider],
})
export class ServerConfigModule {}
