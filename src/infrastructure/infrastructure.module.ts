import { Module } from '@nestjs/common'

import { AmplitudeModule } from './amplitude/amplitude.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { AuthzModule } from './authz/authz.module'
import { FlagsmithModule } from './flagsmith/flagsmith.module'
import { ORMModule } from './orm/orm.module'
import { SentryModule } from './sentry/sentry.module'

@Module({
  imports: [
    AuthzModule,
    ORMModule,
    AnalyticsModule,
    SentryModule,
    AmplitudeModule,
    FlagsmithModule,
  ],
})
export class InfrastructureModule {}
