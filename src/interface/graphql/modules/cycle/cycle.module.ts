import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'

import { CycleGraphQLResolver } from './resolvers/cycle.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule],
  providers: [CycleGraphQLResolver],
})
export class CycleGraphQLModule {}
