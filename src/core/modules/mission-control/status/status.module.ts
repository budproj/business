import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { KeyResultModule } from '@core/modules/key-result/key-result.module'
import { WorkspaceModule } from '@core/modules/workspace/workspace.module'

import { StatusProvider } from './status.provider'
import { TeamStatusProvider } from './team/team-status.provider'

@Module({
  imports: [TypeOrmModule.forFeature(), WorkspaceModule, KeyResultModule],
  providers: [StatusProvider, TeamStatusProvider],
  exports: [StatusProvider, TeamStatusProvider],
})
export class StatusModule {}
