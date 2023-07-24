import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '@core/modules/user/user.module'

import { TeamTreeQueries } from './team-tree-queries.provider'
import { TeamProvider } from './team.provider'
import { TeamRepository } from './team.repository'

@Module({
  imports: [TypeOrmModule.forFeature([TeamRepository]), UserModule],
  providers: [TeamProvider, TeamTreeQueries],
  exports: [TeamProvider, TeamTreeQueries],
})
export class TeamModule {}
