import { Module } from '@nestjs/common'

import { AnalyticsModule } from './analytics/analytics.module'
import { AuthzModule } from './authz/authz.module'
import { ORMModule } from './orm/orm.module'

@Module({
  imports: [AuthzModule, ORMModule, AnalyticsModule],
})
export class InfrastructureModule {}
