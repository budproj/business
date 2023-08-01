import { Module } from '@nestjs/common/decorators/modules/module.decorator'

import { WorkspaceModule } from '@core/modules/workspace/workspace.module'

import { CompanyOverviewProvider } from './overview/company/company-overview.provider'
import { OverviewModule } from './overview/overview.module'
import { StatusModule } from './status/status.module'

@Module({
  imports: [OverviewModule, StatusModule, WorkspaceModule],
  providers: [CompanyOverviewProvider],
  exports: [OverviewModule, StatusModule],
})
export class MissionControlModule {}
