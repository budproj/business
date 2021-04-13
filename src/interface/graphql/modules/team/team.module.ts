import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'

import { TeamsConnectionGraphQLResolver } from './connections/teams/teams-connection.resolver'
import { TeamGraphQLResolver } from './team.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule],
  providers: [TeamGraphQLResolver, TeamsConnectionGraphQLResolver],
})
export class TeamGraphQLModule {}
