import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'
import { KeyResultGraphQLModule } from '@interface/graphql/modules/key-result/key-result.module'
import { ObjectiveGraphQLModule } from '@interface/graphql/modules/objective/objective.module'

import { UserGraphQLModule } from '../user/user.module'

import { TeamCyclesConnectionGraphQLResolver } from './connections/team-cycles/team-cycles.resolver'
import { TeamKeyResultsConnectionGraphQLResolver } from './connections/team-key-results/team-key-results.resolver'
import { TeamObjectivesConnectionGraphQLResolver } from './connections/team-objectives/team-objectives.resolver'
import { TeamTeamsConnectionGraphQLResolver } from './connections/team-teams/team-teams.resolver'
import { TeamUsersConnectionGraphQLResolver } from './connections/team-users/team-users.resolver'
import { TeamsConnectionGraphQLResolver } from './connections/teams/teams.resolver'
import { TeamAccessControl } from './team.access-control'
import { TeamGraphQLResolver } from './team.resolver'

@Module({
  imports: [
    CoreModule,
    GraphQLConfigModule,
    KeyResultGraphQLModule,
    ObjectiveGraphQLModule,
    UserGraphQLModule,
  ],
  providers: [
    TeamAccessControl,
    TeamGraphQLResolver,
    TeamsConnectionGraphQLResolver,
    TeamUsersConnectionGraphQLResolver,
    TeamTeamsConnectionGraphQLResolver,
    TeamCyclesConnectionGraphQLResolver,
    TeamObjectivesConnectionGraphQLResolver,
    TeamKeyResultsConnectionGraphQLResolver,
  ],
})
export class TeamGraphQLModule {}
