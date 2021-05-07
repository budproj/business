import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'
import { AmplitudeModule } from '@infrastructure/amplitude/amplitude.module'

import { TeamCyclesConnectionGraphQLResolver } from './connections/team-cycles/team-cycles.resolver'
import { TeamKeyResultsConnectionGraphQLResolver } from './connections/team-key-results/team-key-results.resolver'
import { TeamTeamsConnectionGraphQLResolver } from './connections/team-teams/team-teams.resolver'
import { TeamUsersConnectionGraphQLResolver } from './connections/team-users/team-users.resolver'
import { TeamsConnectionGraphQLResolver } from './connections/teams/teams.resolver'
import { TeamGraphQLResolver } from './team.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule, AmplitudeModule],
  providers: [
    TeamGraphQLResolver,
    TeamsConnectionGraphQLResolver,
    TeamUsersConnectionGraphQLResolver,
    TeamTeamsConnectionGraphQLResolver,
    TeamCyclesConnectionGraphQLResolver,
    TeamKeyResultsConnectionGraphQLResolver,
  ],
})
export class TeamGraphQLModule {}
