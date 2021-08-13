import { Module } from '@nestjs/common'
import { ClientProxyFactory } from '@nestjs/microservices'

import { AnalyticsConfigModule } from '@config/analytics/analytics.module'
import { AnalyticsConfigProvider } from '@config/analytics/analytics.provider'

@Module({
  imports: [AnalyticsConfigModule],
  providers: [
    {
      provide: 'ANALYTICS_GRPC_SERVER',
      useFactory: (configProvider: AnalyticsConfigProvider) => {
        const { connection } = configProvider

        return ClientProxyFactory.create(connection)
      },
      inject: [AnalyticsConfigProvider],
    },
  ],
})
export class AnalyticsModule {}
