import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CompanyOverviewProvider } from './company/company-overview.provider'
import { OverviewProvider } from './overview.provider'

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [OverviewProvider, CompanyOverviewProvider],
  exports: [OverviewProvider, CompanyOverviewProvider],
})
export class OverviewModule {}
