import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'

import { TeamGraphQLResolver } from './resolvers/team.resolver'

@Module({
  imports: [CoreModule],
  providers: [TeamGraphQLResolver],
})
export class TeamGraphQLModule {}
