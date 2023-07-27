import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '@core/modules/user/user.module'
import { WorkspaceModule } from '@core/modules/workspace/workspace.module'

import { TeamProvider } from './team.provider'
import { TeamRepository } from './team.repository'

@Module({
  imports: [TypeOrmModule.forFeature([TeamRepository]), WorkspaceModule, UserModule],
  providers: [TeamProvider],
  exports: [TeamProvider],
})
export class TeamModule {}
