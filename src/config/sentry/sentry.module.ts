import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { sentryConfig } from './sentry.config'
import { SentryConfigProvider } from './sentry.provider'
import { SentryEnvironmentSchema } from './sentry.schema'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [sentryConfig],
      validationSchema: SentryEnvironmentSchema,
    }),
  ],
  providers: [ConfigService, SentryConfigProvider],
  exports: [ConfigService, SentryConfigProvider],
})
export class SentryConfigModule {}
