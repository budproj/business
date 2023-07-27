import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { WorkspaceModule } from '@core/modules/workspace/workspace.module'

import { CompanyOverviewProvider } from './company/company-overview.provider'
import { OverviewProvider } from './overview.provider'

@Module({
  imports: [TypeOrmModule.forFeature(), WorkspaceModule],
  providers: [OverviewProvider, CompanyOverviewProvider],
  exports: [OverviewProvider, CompanyOverviewProvider],
})
export class OverviewModule {}
