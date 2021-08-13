import { Module } from '@nestjs/common'
import { ClientProxyFactory } from '@nestjs/microservices'

import { AnalyticsConfigModule } from '@config/analytics/analytics.module'
import { AnalyticsConfigProvider } from '@config/analytics/analytics.provider'

import { AnalyticsProvider } from './analytics.provider'

@Module({
  imports: [AnalyticsConfigModule],
  providers: [
    {
      provide: 'ANALYTICS_GRPC_SERVICE',
      useFactory: (configProvider: AnalyticsConfigProvider) => {
        const { connection } = configProvider

        return ClientProxyFactory.create(connection)
      },
      inject: [AnalyticsConfigProvider],
    },
    AnalyticsProvider,
  ],
  exports: [AnalyticsProvider],
})
export class AnalyticsModule {}
