import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TeamRankingProvider } from './ranking.provider'
import { TeamProvider } from './team.provider'
import { TeamRepository } from './team.repository'

@Module({
  imports: [TypeOrmModule.forFeature([TeamRepository])],
  providers: [TeamProvider, TeamRankingProvider],
  exports: [TeamProvider],
})
export class TeamModule {}
