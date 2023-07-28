import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { KeyResultModule } from '@core/modules/key-result/key-result.module'
import { WorkspaceModule } from '@core/modules/workspace/workspace.module'

import { CycleStatusProvider } from './cycle/cycle-status.provider'
import { StatusProvider } from './status.provider'
import { TeamStatusProvider } from './team/team-status.provider'

@Module({
  imports: [TypeOrmModule.forFeature(), WorkspaceModule, KeyResultModule],
  providers: [StatusProvider, TeamStatusProvider, CycleStatusProvider],
  exports: [StatusProvider, TeamStatusProvider, CycleStatusProvider],
})
export class StatusModule {}
