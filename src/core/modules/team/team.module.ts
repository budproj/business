import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TeamRankingProvider } from './ranking.provider'
import { TeamSpecificationsProvider } from './specifications.provider'
import { TeamProvider } from './team.provider'
import { TeamRepository } from './team.repository'

@Module({
  imports: [TypeOrmModule.forFeature([TeamRepository])],
  providers: [TeamProvider, TeamRankingProvider, TeamSpecificationsProvider],
  exports: [TeamProvider],
})
export class TeamModule {}
