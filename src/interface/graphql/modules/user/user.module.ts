import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'

import { UserGraphQLResolver } from './resolvers/user.resolver'
import { UsersConnectionGraphQLResolver } from './resolvers/users-connection.resolver'

@Module({
  imports: [CoreModule],
  providers: [UserGraphQLResolver, UsersConnectionGraphQLResolver],
})
export class UserGraphQLModule {}
