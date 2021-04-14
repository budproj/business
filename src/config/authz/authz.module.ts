import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AuthzEnvironmentSchema } from './authz-environment.schema'
import { authzConfig } from './authz.config'
import { AuthzConfigProvider } from './authz.provider'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authzConfig],
      validationSchema: AuthzEnvironmentSchema,
    }),
  ],
  providers: [ConfigService, AuthzConfigProvider],
  exports: [ConfigService, AuthzConfigProvider],
})
export class AuthzConfigModule {}
