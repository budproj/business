import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'

import { UserTeamsConnectionGraphQLResolver } from './resolvers/user-teams-connection.resolver'
import { UserGraphQLResolver } from './resolvers/user.resolver'
import { UsersConnectionGraphQLResolver } from './resolvers/users-connection.resolver'

@Module({
  imports: [CoreModule],
  providers: [
    UserGraphQLResolver,
    UsersConnectionGraphQLResolver,
    UserTeamsConnectionGraphQLResolver,
  ],
})
export class UserGraphQLModule {}
