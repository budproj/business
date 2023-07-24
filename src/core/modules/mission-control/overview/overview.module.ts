import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CycleModule } from '@core/modules/cycle/cycle.module'
import { KeyResultModule } from '@core/modules/key-result/key-result.module'
import { ObjectiveModule } from '@core/modules/objective/objective.module'
import { TeamModule } from '@core/modules/team/team.module'

import { CompanyOverviewProvider } from './company-overview.provider'
import { OverviewAggregatorFactory } from './overview-aggregator-factory'
import { OverviewProvider } from './overview.provider'

@Module({
  imports: [TypeOrmModule.forFeature(), TeamModule, CycleModule, ObjectiveModule, KeyResultModule],
  providers: [OverviewProvider, CompanyOverviewProvider, OverviewAggregatorFactory],
  exports: [OverviewProvider, CompanyOverviewProvider],
})
export class OverviewModule {}
