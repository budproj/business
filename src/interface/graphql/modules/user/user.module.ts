import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'

import { UserGraphQLResolver } from './resolvers/user.resolver'

@Module({
  imports: [CoreModule],
  providers: [UserGraphQLResolver],
})
export class UserGraphQLModule {}
