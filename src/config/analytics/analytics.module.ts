import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { analyticsConfig } from './analytics.config'
import { AnalyticsEnvironmentSchema } from './analytics.environment-schema'
import { AnalyticsConfigProvider } from './analytics.provider'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [analyticsConfig],
      validationSchema: AnalyticsEnvironmentSchema,
    }),
  ],
  providers: [ConfigService, AnalyticsConfigProvider],
  exports: [ConfigService, AnalyticsConfigProvider],
})
export class AnalyticsConfigModule {}
