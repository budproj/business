import { Module } from '@nestjs/common/decorators/modules/module.decorator'

import { WorkspaceModule } from '@core/modules/workspace/workspace.module'

import { CompanyOverviewProvider } from './overview/company/company-overview.provider'
import { OverviewModule } from './overview/overview.module'

@Module({
  imports: [OverviewModule, WorkspaceModule],
  providers: [CompanyOverviewProvider],
  exports: [CompanyOverviewProvider],
})
export class MissionControlModule {}
