import { Module } from '@nestjs/common/decorators/modules/module.decorator'

import { OverviewAggregatorFactory } from './overview/overview-aggregator-factory'
import { TeamModule } from '@core/modules/team/team.module'

import { CompanyOverviewProvider } from './overview/company-overview.provider'
import { OverviewModule } from './overview/overview.module'

@Module({
  imports: [OverviewModule, TeamModule],
  providers: [CompanyOverviewProvider, OverviewAggregatorFactory],
  exports: [CompanyOverviewProvider],
})
export class MissionControlModule {}
