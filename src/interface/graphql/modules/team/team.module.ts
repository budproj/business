import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'

import { TeamGraphQLResolver } from './team.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule],
  providers: [TeamGraphQLResolver],
})
export class TeamGraphQLModule {}
