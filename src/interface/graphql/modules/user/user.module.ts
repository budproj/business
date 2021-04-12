import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'

import { UserKeyResultCommentsConnectionGraphQLResolver } from './resolvers/user-key-result-comments.resolver'
import { UserKeyResultsConnectionGraphQLResolver } from './resolvers/user-key-results.resolver'
import { UserObjectivesConnectionGraphQLResolver } from './resolvers/user-objectives.connection.resolver'
import { UserTeamsConnectionGraphQLResolver } from './resolvers/user-teams-connection.resolver'
import { UserGraphQLResolver } from './resolvers/user.resolver'
import { UsersConnectionGraphQLResolver } from './resolvers/users-connection.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule],
  providers: [
    UserGraphQLResolver,
    UsersConnectionGraphQLResolver,
    UserTeamsConnectionGraphQLResolver,
    UserObjectivesConnectionGraphQLResolver,
    UserKeyResultsConnectionGraphQLResolver,
    UserKeyResultCommentsConnectionGraphQLResolver,
  ],
})
export class UserGraphQLModule {}
